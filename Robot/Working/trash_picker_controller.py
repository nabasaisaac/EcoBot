#!/usr/bin/env python3
"""
Autonomous trash-picking controller for MasterPi.
Runs on your PC: gets camera stream from robot, runs YOLO (best.pt), sends RPC
commands to drive chassis and run kinematics-based arm pickup.
"""

import cv2
import time
import requests
import threading
from queue import Queue, Empty
from ultralytics import YOLO

# =============================================================================
# CONFIG – adjust for your network and model
# =============================================================================

ROBOT_IP = "172.20.10.8"
STREAM_URL = f"http://{ROBOT_IP}:8080?action=stream"
RPC_URL = f"http://{ROBOT_IP}:9030/jsonrpc"

MODEL_PATH = "best.pt"

# Frame size for processing (smaller = less lag, faster inference)
FRAME_W = 320
FRAME_H = 240
CENTER_X = FRAME_W // 2
CENTER_Y = FRAME_H // 2

# How close target center must be to image center before pickup (pixels)
# Wider = trigger pickup sooner so we don't drive past (helps with lag)
CENTER_THRESHOLD_X = 70   # was 50 – wider so we stop before passing
CENTER_THRESHOLD_Y = 70   # was 55

# Min frames with target centered before triggering pickup (fewer = stop sooner)
CENTERED_STABLE_FRAMES = 2   # was 5 – stop quickly once in zone so we don't drive past
CLOSE_AREA_RATIO = 0.12     # area > this fraction of frame = "close"
CLOSE_STABLE_FRAMES = 1     # when close, trigger after 1 frame

# --- Slow mode: move in short pulses so we don't run past (start with True to get things working)
# Uses timer-based movement (no sleep in main loop) so the video window stays responsive.
SLOW_MODE = True
MOVE_PULSE_S = 0.08   # shorter forward pulse so we don't overshoot (was 0.12)
TURN_PULSE_S = 0.10   # seconds to turn per step
STOP_PAUSE_S = 0.35   # seconds stopped after each pulse (slightly shorter)

# YOLO
CONF_THRESH = 0.5
INFERENCE_SIZE = 320

# Run YOLO in a separate thread so the video window stays responsive (no freezing)
USE_YOLO_THREAD = True   # True = YOLO runs in background thread; main thread only does camera + control + display
# When not using thread: run YOLO every N frames (only used if USE_YOLO_THREAD is False)
INFERENCE_EVERY_N = 1

# Flush frames from stream buffer (higher = less lag, fewer fps; lower = smoother feed but robot may react to stale data)
STREAM_BUFFER_FLUSH = 10

# --- Reduce weird movement from camera lag: smooth target position and require consistent direction
SMOOTH_ALPHA = 0.55       # Target smoothing: 0=very smooth/slow, 1=no smoothing. Lower = less reaction to single stale frame.
DIRECTION_CONSISTENCY = 2 # Only change movement (left/right/forward) after this many frames with same direction (stops zigzag).

# Pickup: SERVO_SEQUENCE = fixed angles (same every time). DYNAMIC_ARM = use ArmMoveIk with estimated (x,y,z).
USE_DYNAMIC_ARM = False   # True = arm adjusts to estimated trash position via ArmMoveIk (needs robot ArmIK working).
# When USE_DYNAMIC_ARM: map pixel (cx,cy) + sonar to arm coords. Image center = (0, y). Scale pixel offset to x_arm.
PIXEL_TO_ARM_X_SCALE = 0.08   # (cx - CENTER_X) * this → x_arm (cm). Tune so left/right in image ≈ left/right in arm.
ARM_Y_FROM_SONAR = True       # True = use sonar cm as y_arm (forward). False = use ARM_Y_DEFAULT.
ARM_Y_DEFAULT_CM = 10.0       # Forward (cm) when not using sonar.
ARM_Z_PICKUP_CM = 2.5         # Height (cm) for gripper at pickup (trash on ground).
# Servo 1 = gripper (angle -90 = open, 90 = close). Servos 3,4,5,6 = arm (only used when not USE_DYNAMIC_ARM).

# --- Arm reach (from MasterPi ArmIK / ColorSorting, in cm from arm base)
# Forward (Y): ~0–17 cm. Left/right (X): ~-18 to +10 cm. Height (Z): ~-3 to 20 cm.
# So rubbish should be roughly 5–18 cm in front of the robot to be reachable.
# Optional: use sonar to only pickup when in range (see REACH_SONAR_CM below).
ARM_REACH_FORWARD_CM = (5, 18)   # (min, max) cm in front – approximate
REACH_SONAR_CM = None            # None = don't use sonar. Or (min_cm, max_cm) e.g. (8, 25) to only pickup when sonar says 8–25 cm.

# When to STOP: (1) when target is centered and stable → then run pickup.
#               (2) when no target seen for LOST_FRAMES_STOP → stop chassis.
LOST_FRAMES_STOP = 15

# =============================================================================
# RPC CLIENT
# =============================================================================

_session = requests.Session()
_session.headers.update({"Content-Type": "application/json"})


def rpc(method, params):
    payload = {"jsonrpc": "2.0", "method": method, "params": params, "id": 0}
    try:
        r = _session.post(RPC_URL, json=payload, timeout=2.0)
        data = r.json()
        if "error" in data:
            return False, data["error"].get("message", "Unknown error")
        return True, data.get("result")
    except Exception as e:
        return False, str(e)


def stop_chassis():
    rpc("SetMovementAngle", [-1])


def set_movement_angle(angle_deg):
    """90=forward, 270=back, 0=right, 180=left. -1=stop."""
    rpc("SetMovementAngle", [angle_deg])


def arm_move_ik(x, y, z, alpha, alpha1, alpha2, movetime_ms):
    """Move arm to (x,y,z) cm using robot's IK. Returns True if success."""
    ok, out = rpc("ArmMoveIk", [x, y, z, alpha, alpha1, alpha2, movetime_ms])
    return ok and out is not False and out is not None


def set_pwm_servo(time_ms, servo_count, *pairs):
    """pairs: (servo_id, angle_deg), angle in [-90, 90]. Servo 1 = gripper."""
    flat = [time_ms, servo_count]
    for s, a in pairs:
        flat.extend([s, a])
    rpc("SetPWMServo", flat)
    time.sleep(time_ms / 1000.0 + 0.4)


def get_sonar_cm():
    ok, out = rpc("GetSonarDistance", [])
    if ok and isinstance(out, (list, tuple)) and len(out) >= 2:
        return out[1]  # (True, distance, 'GetSonarDistance')
    return None


# =============================================================================
# PICKUP: fixed servo sequence OR dynamic ArmMoveIk
# =============================================================================


def pixel_to_arm(cx, cy, sonar_cm=None):
    """Estimate arm (x, y, z) from image center and optional sonar. Tune PIXEL_TO_ARM_X_SCALE and ARM_* to match your setup."""
    x_arm = (cx - CENTER_X) * PIXEL_TO_ARM_X_SCALE
    x_arm = max(-15, min(15, x_arm))  # clamp to rough reach
    if ARM_Y_FROM_SONAR and sonar_cm is not None and 5 <= sonar_cm <= 25:
        y_arm = sonar_cm
    else:
        y_arm = ARM_Y_DEFAULT_CM
    y_arm = max(0, min(18, y_arm))
    z_arm = ARM_Z_PICKUP_CM
    return (x_arm, y_arm, z_arm)


def set_default_arm_pose():
    """Set arm to default/neutral pose (same as working_arm_movement.py 'Neutral pose')."""
    set_pwm_servo(1000, 5, (1, 0), (3, 90), (4, -90), (5, 50), (6, 0))


def run_pickup_sequence(trash_cx=None, trash_cy=None, sonar_cm=None):
    """Full pickup. If USE_DYNAMIC_ARM and (trash_cx, trash_cy) given, arm uses ArmMoveIk to that position; else fixed servo sequence."""
    stop_chassis()
    time.sleep(0.3)

    if USE_DYNAMIC_ARM and trash_cx is not None and trash_cy is not None:
        # Dynamic: move arm to estimated (x,y,z) via IK
        x_arm, y_arm, z_arm = pixel_to_arm(trash_cx, trash_cy, sonar_cm)
        set_pwm_servo(500, 1, (1, -90))  # open gripper
        time.sleep(0.5)
        if arm_move_ik(x_arm, y_arm, z_arm, -90, -90, 0, 1500):
            time.sleep(1.6)
        set_pwm_servo(1000, 1, (1, 90))   # close gripper
        time.sleep(1.0)
        arm_move_ik(0, 8, 18, 0, -90, 90, 1500)  # lift
        time.sleep(1.6)
        set_pwm_servo(1000, 1, (1, -90))  # release
        time.sleep(0.5)
        arm_move_ik(0, 6, 18, 0, -90, 90, 1500)  # home
        time.sleep(1.6)
    else:
        # Fixed: same servo sequence as working_arm_movement.py
        set_pwm_servo(1500, 5, (1, -90), (3, 50), (4, -30), (5, -90), (6, 0))
        set_pwm_servo(1000, 1, (1, 90))
        set_pwm_servo(1500, 5, (1, 0), (3, -90), (4, -50), (5, 50), (6, 0))
        set_pwm_servo(1000, 1, (1, -90))
        set_pwm_servo(1000, 5, (1, 0), (3, 90), (4, -90), (5, 50), (6, 0))


# =============================================================================
# YOLO WORKER THREAD (runs inference in background so UI stays responsive)
# =============================================================================


def yolo_worker(inference_queue, result_queue, stop_event):
    """Run YOLO in a loop; main thread feeds frames and reads results."""
    model = YOLO(MODEL_PATH)
    last_box = None
    lost_frames = 0
    while not stop_event.is_set():
        try:
            frame = inference_queue.get(timeout=0.2)
        except Empty:
            continue
        results = model.track(
            frame,
            persist=True,
            imgsz=INFERENCE_SIZE,
            conf=CONF_THRESH,
            verbose=False,
        )
        best_box = None
        best_error = 9999
        for r in results:
            if r.boxes is None:
                continue
            boxes = r.boxes.xyxy.cpu().numpy()
            confs = r.boxes.conf.cpu().numpy()
            for box, conf in zip(boxes, confs):
                x1, y1, x2, y2 = map(int, box)
                area = (x2 - x1) * (y2 - y1)
                if area > FRAME_W * FRAME_H * 0.5:
                    continue
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2
                err = abs(cx - CENTER_X) + abs(cy - CENTER_Y) * 0.5
                if err < best_error:
                    best_error = err
                    best_box = (x1, y1, x2, y2, conf, cx, cy, area)
        if best_box is not None:
            last_box = best_box
            lost_frames = 0
        else:
            lost_frames += 1
        try:
            result_queue.put_nowait((last_box, lost_frames))
        except Exception:
            pass


# =============================================================================
# DETECTION + CONTROL LOOP
# =============================================================================


def main():
    if USE_YOLO_THREAD:
        print("YOLO will run in background thread (window should stay responsive).")
    else:
        print("Loading YOLO model:", MODEL_PATH)
        model = YOLO(MODEL_PATH)

    print("Connecting to camera:", STREAM_URL)
    cap = cv2.VideoCapture(STREAM_URL)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    time.sleep(2)
    if not cap.isOpened():
        print("Camera connection failed. Check ROBOT_IP and that MasterPi is running.")
        return
    print("Camera OK")

    # Set default arm position first (neutral pose)
    print("Setting default arm pose...")
    set_default_arm_pose()
    print("Arm ready.")

    last_box = None
    lost_frames = 0
    centered_count = 0
    state = "SEARCH"
    frame_count = 0
    last_dx = 0
    # Smoothed target position (reduces jumpy/weird movement from camera lag)
    smooth_cx, smooth_cy = CENTER_X, CENTER_Y
    # Only change movement direction after DIRECTION_CONSISTENCY frames (stops zigzag from lag)
    last_sent_angle = None
    direction_agree_count = 0
    # Timer-based slow mode: no sleep in main loop so window stays responsive
    slow_end_time = 0.0
    slow_phase = "idle"  # "idle" | "moving" | "paused"

    inference_queue = Queue(maxsize=1)
    result_queue = Queue(maxsize=1)
    stop_event = threading.Event()
    if USE_YOLO_THREAD:
        model = None
        worker = threading.Thread(target=yolo_worker, args=(inference_queue, result_queue, stop_event), daemon=True)
        worker.start()

    try:
        while True:
            # Timer-based slow mode: when pulse or pause finishes, update state (no blocking sleep)
            if SLOW_MODE and slow_end_time > 0 and time.time() >= slow_end_time:
                if slow_phase == "moving":
                    stop_chassis()
                    slow_phase = "paused"
                    slow_end_time = time.time() + STOP_PAUSE_S
                elif slow_phase == "paused":
                    slow_end_time = 0.0
                    slow_phase = "idle"

            for _ in range(STREAM_BUFFER_FLUSH):
                cap.grab()
            ret, frame = cap.retrieve()
            if not ret:
                continue

            frame = cv2.resize(frame, (FRAME_W, FRAME_H))

            if USE_YOLO_THREAD:
                try:
                    inference_queue.put_nowait(frame.copy())
                except Exception:
                    pass
                try:
                    last_box, lost_frames = result_queue.get_nowait()
                except Empty:
                    pass
            else:
                if frame_count % INFERENCE_EVERY_N == 0:
                    results = model.track(
                        frame,
                        persist=True,
                        imgsz=INFERENCE_SIZE,
                        conf=CONF_THRESH,
                        verbose=False,
                    )
                    best_box = None
                    best_error = 9999
                    for r in results:
                        if r.boxes is None:
                            continue
                        boxes = r.boxes.xyxy.cpu().numpy()
                        confs = r.boxes.conf.cpu().numpy()
                        for box, conf in zip(boxes, confs):
                            x1, y1, x2, y2 = map(int, box)
                            area = (x2 - x1) * (y2 - y1)
                            if area > FRAME_W * FRAME_H * 0.5:
                                continue
                            cx = (x1 + x2) // 2
                            cy = (y1 + y2) // 2
                            area = (x2 - x1) * (y2 - y1)
                            err = abs(cx - CENTER_X) + abs(cy - CENTER_Y) * 0.5
                            if err < best_error:
                                best_error = err
                                best_box = (x1, y1, x2, y2, conf, cx, cy, area)
                    if best_box is not None:
                        last_box = best_box
                        lost_frames = 0
                    else:
                        lost_frames += 1

            frame_count += 1

            # Use last known target for control when we have it (remember position for a few frames when lost)
            if lost_frames < LOST_FRAMES_STOP and last_box is not None:
                # last_box may be 7 or 8 elements (with or without area)
                if len(last_box) == 8:
                    x1, y1, x2, y2, conf, cx, cy, area = last_box
                else:
                    x1, y1, x2, y2, conf, cx, cy = last_box
                    area = (x2 - x1) * (y2 - y1)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.circle(frame, (cx, cy), 5, (0, 0, 255), -1)
                cv2.circle(frame, (int(smooth_cx), int(smooth_cy)), 8, (255, 255, 0), 2)  # smoothed target (yellow)
                cv2.putText(
                    frame, f"conf:{conf:.2f}", (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2
                )

                # Smooth target position to reduce reaction to single stale/laggy frame
                if lost_frames == 0:
                    smooth_cx = SMOOTH_ALPHA * smooth_cx + (1 - SMOOTH_ALPHA) * cx
                    smooth_cy = SMOOTH_ALPHA * smooth_cy + (1 - SMOOTH_ALPHA) * cy
                    last_dx = (cx - CENTER_X)
                # Use smoothed position for control (not raw cx, cy)
                dx = smooth_cx - CENTER_X
                dy = smooth_cy - CENTER_Y
                centered_x = abs(dx) < CENTER_THRESHOLD_X
                centered_y = abs(dy) < CENTER_THRESHOLD_Y
                centered = centered_x and centered_y
                frame_area = FRAME_W * FRAME_H
                is_close = (area / frame_area) >= CLOSE_AREA_RATIO
                required_stable = CLOSE_STABLE_FRAMES if is_close else CENTERED_STABLE_FRAMES

                if state == "SEARCH":
                    if centered:
                        centered_count += 1
                        # Optional: only pickup when sonar says trash is in reach
                        in_reach = True
                        if REACH_SONAR_CM is not None:
                            d = get_sonar_cm()
                            if d is not None:
                                low, high = REACH_SONAR_CM
                                in_reach = low <= d <= high
                        if centered_count >= required_stable and in_reach:
                            stop_chassis()
                            time.sleep(0.25)
                            state = "PICKUP"
                            centered_count = 0
                    else:
                        centered_count = 0
                        use_dx = dx if lost_frames == 0 else last_dx
                        need_turn = abs(use_dx) > CENTER_THRESHOLD_X
                        desired_angle = (0 if use_dx > 0 else 180) if need_turn else 90

                        # Only change direction after DIRECTION_CONSISTENCY frames (stops zigzag from lag)
                        if desired_angle == last_sent_angle:
                            direction_agree_count = 0
                            angle_to_send = desired_angle
                        else:
                            direction_agree_count += 1
                            if direction_agree_count >= DIRECTION_CONSISTENCY:
                                last_sent_angle = desired_angle
                                direction_agree_count = 0
                                angle_to_send = desired_angle
                            else:
                                angle_to_send = last_sent_angle if last_sent_angle is not None else desired_angle
                                if last_sent_angle is None:
                                    last_sent_angle = desired_angle
                        if last_sent_angle is None:
                            last_sent_angle = desired_angle

                        if SLOW_MODE:
                            # Only start a new pulse when idle (no sleep – keeps window responsive)
                            if slow_end_time > 0:
                                pass  # still in pulse or pause, loop will draw and wait
                            else:
                                pulse_s = TURN_PULSE_S if need_turn else MOVE_PULSE_S
                                set_movement_angle(angle_to_send)
                                slow_end_time = time.time() + pulse_s
                                slow_phase = "moving"
                        else:
                            set_movement_angle(angle_to_send)

                elif state == "PICKUP":
                    run_pickup_sequence(trash_cx=cx, trash_cy=cy, sonar_cm=get_sonar_cm())
                    state = "SEARCH"
                    last_box = None
            else:
                # No target (or lost for too long): STOP and reset direction state
                stop_chassis()
                centered_count = 0
                last_sent_angle = None
                direction_agree_count = 0
                if state not in ("PICKUP",):
                    state = "SEARCH"

            # Crosshair
            cv2.line(frame, (CENTER_X, 0), (CENTER_X, FRAME_H), (255, 0, 0), 2)
            cv2.line(frame, (0, CENTER_Y), (FRAME_W, CENTER_Y), (255, 0, 0), 2)
            cv2.putText(
                frame, state, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                (0, 255, 255) if state == "PICKUP" else (0, 255, 0), 2
            )
            if SLOW_MODE:
                cv2.putText(frame, "SLOW", (10, 55), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 0), 2)
            if USE_DYNAMIC_ARM:
                cv2.putText(frame, "DYNAMIC ARM", (10, 78), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
            # Stop when: no target (STOP) or centered+stable (then PICKUP)
            if last_box is None or lost_frames >= LOST_FRAMES_STOP:
                cv2.putText(frame, "Stop: no target", (10, FRAME_H - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 200, 255), 2)
            elif REACH_SONAR_CM is not None and last_box is not None:
                d = get_sonar_cm()
                if d is not None:
                    low, high = REACH_SONAR_CM
                    if d < low:
                        cv2.putText(frame, "Too close (%.0f cm)" % d, (10, FRAME_H - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
                    elif d > high:
                        cv2.putText(frame, "Too far (%.0f cm)" % d, (10, FRAME_H - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 165, 255), 2)
                    else:
                        cv2.putText(frame, "In reach (%.0f cm)" % d, (10, FRAME_H - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 2)

            cv2.imshow("Trash Picker", frame)
            if cv2.waitKey(1) == 27:
                break
    finally:
        if USE_YOLO_THREAD:
            stop_event.set()
        stop_chassis()
        cap.release()
        cv2.destroyAllWindows()
        print("Stopped.")


if __name__ == "__main__":
    main()
