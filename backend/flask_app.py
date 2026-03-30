"""
Backend for Ecobot manual control: camera + YOLO trash detection + Xbox control + MJPEG stream.
Based on working_trash_manual_detection.py. Start/stop via API; stream shows live feed with bounding boxes.
"""
import os
import threading
import time
import requests
import cv2
import numpy as np
from queue import Queue
from flask import Flask, Response, jsonify
from flask_cors import CORS

import autonomous_trash_collector as autonomous_tc

def get_pygame():
    import pygame as pg
    return pg

# ================= CONFIG =================
ROBOT_IP = "172.20.10.8"
RPC_URL = f"http://{ROBOT_IP}:9030/jsonrpc"
STREAM_URL = f"http://{ROBOT_IP}:8080?action=stream"

DISPLAY_W = 640
DISPLAY_H = 480

# best.pt in same directory as this script
YOLO_MODEL = "best.pt"
YOLO_CONF = 0.5
YOLO_FRAME_SKIP = 3
MAX_BBOX_AREA_RATIO = 0.45

# ================= APP =================
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ================= GLOBALS =================
session = requests.Session()
sonar_cm = 0
movement_commands = 0
latest_frame = None
frame_lock = threading.Lock()
pickup_running = False
pickup_lock = threading.Lock()
control_running = False
control_lock = threading.Lock()

yolo_results = None
yolo_lock = threading.Lock()
frame_counter = 0
last_frame_shape = None

# Gamepad loop state (used by gamepad thread)
last_move = None
last_rotation = None
auto_mode = False
target_class = "any"
current_target = None
trash_classes = {}
servo_positions = {1: -90, 3: 90, 4: -90, 5: 30, 6: 0}
arm_prev = {"dpad_x": 0, "dpad_y": 0, "axis_2": 0, "axis_3": 0, "axis_4": 0, "axis_5": 0}
gripper_open_state = True

# Thread handles
camera_thread_handle = None
yolo_thread_handle = None
sonar_thread_handle = None
gamepad_thread_handle = None

# ================= RPC =================
def rpc(method, params):
    payload = {"method": method, "params": params, "jsonrpc": "2.0", "id": 0}
    try:
        r = session.post(RPC_URL, json=payload, timeout=0.5)
        return r.json()
    except Exception as e:
        print(f"RPC Error: {e}")
        return None

# ================= SONAR =================
def sonar_thread_fn():
    global sonar_cm
    while control_running:
        try:
            r = rpc("GetSonarDistance", [])
            if r and "result" in r:
                try:
                    sonar_cm = int(r["result"][1] / 10)
                except Exception:
                    pass
        except Exception:
            pass
        time.sleep(0.2)

# ================= YOLO =================
def yolo_thread_fn():
    global yolo_results, latest_frame, frame_counter, last_frame_shape
    base = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base, "best.pt")
    try:
        from ultralytics import YOLO
        model = YOLO(model_path)
        print("YOLO model loaded:", model_path)
    except Exception as e:
        print("YOLO load error:", e)
        return
    while control_running:
        with frame_lock:
            if latest_frame is not None:
                frame_to_process = latest_frame.copy()
                current_frame_num = frame_counter
                last_frame_shape = frame_to_process.shape[:2]
            else:
                time.sleep(0.03)
                continue
        if current_frame_num % YOLO_FRAME_SKIP == 0:
            last_frame_shape = frame_to_process.shape[:2]
            try:
                results = model(frame_to_process, conf=YOLO_CONF, verbose=False)
                with yolo_lock:
                    yolo_results = results[0]
            except Exception as e:
                print("YOLO run error:", e)
        time.sleep(0.01)

def get_detected_objects():
    global last_frame_shape
    with yolo_lock:
        if yolo_results and hasattr(yolo_results, "boxes") and len(yolo_results.boxes) > 0:
            objects = []
            frame_area = None
            if last_frame_shape is not None:
                frame_area = last_frame_shape[0] * last_frame_shape[1]
                max_area = frame_area * MAX_BBOX_AREA_RATIO
            for box in yolo_results.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                area = (int(x2) - int(x1)) * (int(y2) - int(y1))
                if frame_area is not None and area > max_area:
                    continue
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                name = yolo_results.names[cls]
                objects.append({
                    "name": name, "conf": conf,
                    "bbox": (int(x1), int(y1), int(x2), int(y2)),
                    "center": ((int(x1) + int(x2)) // 2, (int(y1) + int(y2)) // 2),
                    "area": area,
                })
            return objects
    return []

def get_trash_classes():
    with yolo_lock:
        if yolo_results and hasattr(yolo_results, "names"):
            return dict(yolo_results.names)
    return {}

def get_closest_trash(target_class_filter=None):
    objects = get_detected_objects()
    if not objects:
        return None
    if target_class_filter and target_class_filter != "any":
        objects = [o for o in objects if o["name"] == target_class_filter]
    if not objects:
        return None
    return max(objects, key=lambda o: o["area"])

# ================= CAMERA =================
def camera_thread_fn():
    global latest_frame, frame_counter
    cap = cv2.VideoCapture(STREAM_URL)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    if not cap.isOpened():
        print("Failed to open camera stream:", STREAM_URL)
        return
    while control_running:
        try:
            ret, frame = cap.read()
            if ret:
                with frame_lock:
                    latest_frame = frame.copy()
                    frame_counter += 1
            else:
                cap.release()
                time.sleep(1)
                cap = cv2.VideoCapture(STREAM_URL)
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        except Exception as e:
            print("Camera error:", e)
            time.sleep(0.1)
    cap.release()

# ================= MOVEMENT / ARM =================
def move(angle):
    cmd_angle = -90 if angle == 270 else angle
    rpc("SetMovementAngle", [cmd_angle])

def stop():
    rpc("SetMovementAngle", [-1])

def rotate_left():
    rpc("SetBrushMotor", [1, -40, 2, 40, 3, -40, 4, 40])

def rotate_right():
    rpc("SetBrushMotor", [1, 40, 2, -40, 3, 40, 4, -40])

def stop_rotation():
    rpc("SetBrushMotor", [1, 0, 2, 0, 3, 0, 4, 0])

def move_servo(time_ms, servo_count, *args):
    rpc("SetPWMServo", [time_ms, servo_count, *args])
    time.sleep(time_ms / 1000 + 0.2)

def set_servo_position(servo_id, position):
    if servo_id == 6:
        position = max(-90, min(90, position))
    elif servo_id == 1:
        position = max(-90, min(6, position))
    else:
        position = max(-90, min(90, position))
    move_servo(100, 1, servo_id, position)

def gripper_open():
    move_servo(500, 1, 1, 6)

def gripper_close():
    move_servo(500, 1, 1, -90)

def default_pose():
    # Neutral/default arm pose (aligned to test2.py)
    move_servo(1000, 5, 1, -90, 3, 90, 4, -90, 5, 30, 6, 0)

def pickup_sequence():
    global pickup_running
    try:
        stop()
        stop_rotation()
        time.sleep(0.5)
        # Move arm to trash (match test2.py)
        move_servo(1500, 5, 1, -90, 3, 50, 4, -50, 5, -70, 6, 0)
        time.sleep(0.5)
        move_servo(1000, 1, 1, 90)
        time.sleep(0.5)
        # Move arm to back (bin) (match test2.py)
        move_servo(1500, 5, 1, 0, 3, 0, 4, -50, 5, 60, 6, 0)
        time.sleep(0.5)
        move_servo(1000, 1, 1, -90)
        time.sleep(0.5)
        # Back to initial arm position (same as default_pose / test2 neutral)
        default_pose()
        time.sleep(0.5)
    except Exception as e:
        print("Pickup error:", e)
    finally:
        with pickup_lock:
            pickup_running = False

def auto_align_to_trash(trash_object):
    if not trash_object:
        return False
    frame_center_x = DISPLAY_W // 2
    error = trash_object["center"][0] - frame_center_x
    if abs(error) > 50:
        if error > 0:
            rotate_right()
        else:
            rotate_left()
        return False
    stop_rotation()
    return True

def auto_approach_trash(trash_object, min_distance_cm=20):
    if not trash_object:
        stop()
        return False
    area = trash_object["area"]
    target_area = 30000
    if area < target_area and sonar_cm > min_distance_cm:
        move(90)
        return False
    stop()
    return True

def search_for_trash():
    if not get_detected_objects():
        rotate_right()
        return True
    return False

# ================= STREAM: build frame with boxes =================
BBOX_THICKNESS = 3  # Visible bounding boxes on stream

def build_display_frame():
    global last_move, auto_mode, current_target, trash_classes
    with frame_lock:
        if latest_frame is None:
            return None
        display_frame = cv2.resize(latest_frame, (DISPLAY_W, DISPLAY_H))
        h, w = latest_frame.shape[0], latest_frame.shape[1]
    objects = get_detected_objects()
    scale_x = DISPLAY_W / w
    scale_y = DISPLAY_H / h
    # Draw bounding boxes – green for detections, yellow for current target in auto mode
    for obj in objects:
        x1, y1, x2, y2 = obj["bbox"]
        name, conf = obj["name"], obj["conf"]
        x1, x2 = int(x1 * scale_x), int(x2 * scale_x)
        y1, y2 = int(y1 * scale_y), int(y2 * scale_y)
        color = (0, 255, 0)  # BGR green – main color for all detections
        if auto_mode and current_target and obj["center"] == current_target["center"]:
            color = (0, 255, 255)  # BGR yellow for locked target only
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            cv2.line(display_frame, (cx - 15, cy), (cx + 15, cy), (0, 255, 255), 2)
            cv2.line(display_frame, (cx, cy - 15), (cx, cy + 15), (0, 255, 255), 2)
        cv2.rectangle(display_frame, (x1, y1), (x2, y2), color, BBOX_THICKNESS)
        label = f"{name} {conf:.2f}"
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        cv2.rectangle(display_frame, (x1, y1 - th - 6), (x1 + tw + 2, y1), color, -1)
        cv2.putText(display_frame, label, (x1 + 1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    # On-stream overlays (also exposed via /api/status for cards)
    cv2.putText(display_frame, f"Sonar: {sonar_cm} cm", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
    cv2.putText(display_frame, f"Trash detected: {len(objects)}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    mode_text = f"Mode: {'AUTO-TRASH' if auto_mode else 'MANUAL'}"
    cv2.putText(display_frame, mode_text, (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0) if not auto_mode else (0, 255, 255), 2)
    if last_move == 90:
        direction = "FORWARD"
    elif last_move == 270:
        direction = "BACK"
    elif last_move == 0:
        direction = "RIGHT"
    elif last_move == 180:
        direction = "LEFT"
    else:
        direction = "STOP"
    cv2.putText(display_frame, f"Dir: {direction}", (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    if pickup_running:
        cv2.putText(display_frame, "PICKUP IN PROGRESS", (10, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    return display_frame

def get_current_action():
    """Current action for status API – same values as overlay 'Dir:' (FORWARD, BACK, LEFT, RIGHT, STOP, etc.)."""
    global pickup_running, last_move, last_rotation
    if pickup_running:
        return "PICKUP IN PROGRESS"
    if last_move == 90:
        return "FORWARD"
    if last_move == 270:
        return "BACK"
    if last_move == 0:
        return "RIGHT"
    if last_move == 180:
        return "LEFT"
    if last_rotation == "left":
        return "ROTATE LEFT"
    if last_rotation == "right":
        return "ROTATE RIGHT"
    return "STOP"

def generate_frames():
    while control_running:
        frame = build_display_frame()
        if frame is not None:
            try:
                ret, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                if ret:
                    yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")
            except Exception as e:
                print("Encode error:", e)
        time.sleep(0.033)

# ================= GAMEPAD LOOP (runs in background thread) =================
def gamepad_loop():
    global last_move, last_rotation, auto_mode, current_target, trash_classes
    global servo_positions, arm_prev, gripper_open_state, pickup_running
    pg = get_pygame()
    pg.init()
    pg.joystick.init()
    if pg.joystick.get_count() == 0:
        print("No controller found. Connect Xbox and start again.")
        return
    joy = pg.joystick.Joystick(0)
    joy.init()
    print("Controller:", joy.get_name())
    time.sleep(0.5)
    default_pose()
    time.sleep(1)
    while control_running:
        pg.event.pump()
        for event in pg.event.get():
            if event.type == pg.QUIT:
                return
        if not trash_classes:
            trash_classes = get_trash_classes()
        if auto_mode:
            current_target = get_closest_trash(target_class)
            if current_target:
                if auto_align_to_trash(current_target):
                    auto_approach_trash(current_target)
            else:
                if last_move is not None:
                    stop()
                    last_move = None
                search_for_trash()
        else:
            if joy.get_button(1):
                auto_mode = not auto_mode
                stop_rotation()
                time.sleep(0.3)
            if joy.get_button(2):
                target_class = "any"
                time.sleep(0.2)
            x, y = joy.get_axis(0), joy.get_axis(1)
            if abs(x) < 0.2:
                x = 0
            if abs(y) < 0.2:
                y = 0
            angle = None
            if abs(x) > abs(y):
                if x > 0.3:
                    angle = 0
                elif x < -0.3:
                    angle = 180
            else:
                if y > 0.3:
                    angle = 270
                elif y < -0.3:
                    angle = 90
            if angle is not None:
                if angle != last_move:
                    move(angle)
                    last_move = angle
            else:
                if last_move is not None:
                    stop()
                    last_move = None
            if joy.get_button(4):
                if last_rotation != "left":
                    rotate_left()
                    last_rotation = "left"
            elif joy.get_button(5):
                if last_rotation != "right":
                    rotate_right()
                    last_rotation = "right"
            else:
                if last_rotation is not None:
                    stop_rotation()
                    last_rotation = None
            deadzone = 0.2
            if joy.get_numhats() > 0:
                dpad = joy.get_hat(0)
                dx, dy = dpad[0], dpad[1]
                if dx != arm_prev["dpad_x"]:
                    if dx > 0:
                        gripper_close()
                        gripper_open_state = False
                    elif dx < 0:
                        gripper_open()
                        gripper_open_state = True
                    arm_prev["dpad_x"] = dx
                if dy != arm_prev["dpad_y"]:
                    if dy > 0:
                        servo_positions[3] = min(90, servo_positions[3] + 10)
                        set_servo_position(3, servo_positions[3])
                    elif dy < 0:
                        servo_positions[3] = max(-90, servo_positions[3] - 10)
                        set_servo_position(3, servo_positions[3])
                    arm_prev["dpad_y"] = dy
            if joy.get_numaxes() > 3:
                rx, ry = joy.get_axis(2), joy.get_axis(3)
                if abs(rx - arm_prev["axis_2"]) > 0.1 and abs(rx) > deadzone:
                    servo_positions[4] = max(-90, min(90, servo_positions[4] + int(rx * 30)))
                    set_servo_position(4, servo_positions[4])
                    arm_prev["axis_2"] = rx
                if abs(ry - arm_prev["axis_3"]) > 0.1 and abs(ry) > deadzone:
                    servo_positions[5] = max(-90, min(90, servo_positions[5] + int(ry * 30)))
                    set_servo_position(5, servo_positions[5])
                    arm_prev["axis_3"] = ry
            if joy.get_numaxes() > 5:
                lt, rt = joy.get_axis(4), joy.get_axis(5)
                if abs(lt - arm_prev["axis_4"]) > 0.05 and lt > -0.8:
                    servo_positions[6] = max(-90, min(90, servo_positions[6] - int((lt + 1) * 25)))
                    set_servo_position(6, servo_positions[6])
                    arm_prev["axis_4"] = lt
                if abs(rt - arm_prev["axis_5"]) > 0.05 and rt > -0.8:
                    servo_positions[6] = max(-90, min(90, servo_positions[6] + int((rt + 1) * 20)))
                    set_servo_position(6, servo_positions[6])
                    arm_prev["axis_5"] = rt
            if joy.get_button(6):
                default_pose()
                servo_positions[1] = -90
                servo_positions[3], servo_positions[4] = 90, -90
                servo_positions[5], servo_positions[6] = 30, 0
                gripper_open_state = True
                time.sleep(0.5)
            if joy.get_button(0):
                with pickup_lock:
                    if not pickup_running:
                        pickup_running = True
                        threading.Thread(target=pickup_sequence, daemon=True).start()
            if joy.get_button(7):
                return
        time.sleep(0.01)
    # Cleanup on stop
    stop()
    stop_rotation()
    time.sleep(0.5)
    default_pose()
    pg.quit()

# ================= API ROUTES =================
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route("/api/status", methods=["GET"])
def live_status():
    """Live status for cards: sonar_cm, battery, action, trash_count, mode (like autonomous_trash_picker)."""
    battery_voltage = None
    battery_percent = None
    try:
        r = rpc("GetBatteryVoltage", [])
        if r and "result" in r:
            # result can be (True, voltage_mv, 'GetBatteryVoltage') or similar
            res = r["result"]
            if isinstance(res, (list, tuple)) and len(res) >= 2:
                v = res[1]
                if isinstance(v, (int, float)):
                    battery_voltage = round(v / 1000.0, 2) if v >= 100 else round(float(v), 2)  # mV -> V if large
                    # Rough %: assume 12.6V full, 10.5V empty (e.g. 3S LiPo)
                    if battery_voltage and 10 <= battery_voltage <= 13:
                        battery_percent = min(100, max(0, int((battery_voltage - 10.5) / (12.6 - 10.5) * 100)))
    except Exception:
        pass
    objects = get_detected_objects()
    with control_lock:
        active = control_running
    return jsonify({
        "sonar_cm": sonar_cm,
        "battery_voltage": battery_voltage,
        "battery_percent": battery_percent,
        "action": get_current_action() if active else "STOPPED",
        "trash_count": len(objects),
        "mode": "AUTO-TRASH" if auto_mode else "MANUAL",
        "control_active": active,
    }), 200

@app.route("/api/camera/status", methods=["GET"])
def camera_status():
    with control_lock:
        running = control_running
    return jsonify({
        "status": "streaming" if running else "stopped",
        "control_active": running,
    }), 200

@app.route("/api/control/start", methods=["POST"])
def start_control():
    global control_running, camera_thread_handle, yolo_thread_handle, sonar_thread_handle, gamepad_thread_handle
    global latest_frame, last_move, last_rotation, servo_positions, arm_prev, gripper_open_state
    autonomous_tc.stop_autonomous()
    time.sleep(0.6)
    with control_lock:
        if control_running:
            return jsonify({"status": "already_started", "message": "Manual control already running"}), 200
        control_running = True
    last_move = None
    last_rotation = None
    servo_positions = {1: -90, 3: 90, 4: -90, 5: 30, 6: 0}
    arm_prev = {"dpad_x": 0, "dpad_y": 0, "axis_2": 0, "axis_3": 0, "axis_4": 0, "axis_5": 0}
    gripper_open_state = True
    camera_thread_handle = threading.Thread(target=camera_thread_fn, daemon=True)
    camera_thread_handle.start()
    yolo_thread_handle = threading.Thread(target=yolo_thread_fn, daemon=True)
    yolo_thread_handle.start()
    sonar_thread_handle = threading.Thread(target=sonar_thread_fn, daemon=True)
    sonar_thread_handle.start()
    time.sleep(0.5)
    gamepad_thread_handle = threading.Thread(target=gamepad_loop, daemon=True)
    gamepad_thread_handle.start()
    return jsonify({"status": "success", "message": "Manual control started. Use Xbox to drive."}), 200

@app.route("/api/control/stop", methods=["POST"])
def stop_control():
    global control_running
    with control_lock:
        if not control_running:
            return jsonify({"status": "already_stopped", "message": "Manual control not running"}), 200
        control_running = False
    time.sleep(0.3)
    return jsonify({"status": "success", "message": "Manual control stopped"}), 200

@app.route("/api/camera/stream")
def video_stream():
    with control_lock:
        if not control_running:
            return Response("Start manual control first (POST /api/control/start).", status=400, mimetype="text/plain")
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )


# ----- Autonomous (working_autonomous2.py logic via autonomous_trash_collector) -----
@app.route("/api/autonomous/start", methods=["POST"])
def autonomous_start():
    global control_running
    with control_lock:
        if control_running:
            control_running = False
    time.sleep(0.6)
    ok, msg = autonomous_tc.start_autonomous()
    if not ok:
        return jsonify({"status": "already_started", "message": msg}), 200
    return jsonify({"status": "success", "message": "Autonomous trash collection started."}), 200


@app.route("/api/autonomous/stop", methods=["POST"])
def autonomous_stop():
    autonomous_tc.stop_autonomous()
    return jsonify({"status": "success", "message": "Autonomous mode stopping."}), 200


@app.route("/api/autonomous/status", methods=["GET"])
def autonomous_status():
    return jsonify({
        "autonomous_active": autonomous_tc.is_autonomous_running(),
    }), 200


@app.route("/api/autonomous/stream")
def autonomous_video_stream():
    return Response(
        autonomous_tc.generate_autonomous_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )


@app.route("/api/autonomous/snapshot")
def autonomous_snapshot():
    """
    Single JPEG snapshot of the latest annotated frame.
    Useful to debug MJPEG issues vs "robot frame never updates".
    """
    # Import inside handler to avoid circular imports if you refactor later.
    import cv2
    import numpy as np

    # If worker isn't running, still return a placeholder image.
    with autonomous_tc.display_frame_lock:
        frame = autonomous_tc.latest_display_frame
        if frame is None:
            frame = autonomous_tc._placeholder_bgr("Waiting for autonomous frames…")

    try:
        ret, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        if not ret:
            # Return a valid JPEG even if encoding fails.
            placeholder = np.zeros((autonomous_tc.DISPLAY_H, autonomous_tc.DISPLAY_W, 3), dtype=np.uint8)
            ret2, buffer2 = cv2.imencode(".jpg", placeholder, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ret2:
                return Response(status=500)
            return Response(buffer2.tobytes(), mimetype="image/jpeg")
        return Response(buffer.tobytes(), mimetype="image/jpeg")
    except Exception:
        return Response(status=500)

if __name__ == "__main__":
    print("Starting Ecobot backend (manual control + stream)...")
    app.run(host="0.0.0.0", port=5000, threaded=True, debug=False)
