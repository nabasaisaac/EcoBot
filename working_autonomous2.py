import cv2
import time
import requests
import threading
import numpy as np
import collections
from queue import Queue
from ultralytics import YOLO

# ========== CONFIG ==========
ROBOT_IP = "172.20.10.8"
RPC_URL = f"http://{ROBOT_IP}:9030/jsonrpc"
STREAM_URL = f"http://{ROBOT_IP}:8080?action=stream"
YOLO_MODEL = "best.pt"

DISPLAY_W = 640
DISPLAY_H = 480
FRAME_AREA = DISPLAY_W * DISPLAY_H

PICKUP_RELATIVE_THRESHOLD    = 0.12      # 12% of screen → close enough
MOVE_RELATIVE_THRESHOLD      = 0.01      # 3% of screen → start approaching

STABLE_PICKUP_FRAMES = 6
CONFIDENCE_THRESHOLD = 0.40
MAX_VALID_RELATIVE_AREA = 0.65

MOVEMENT_REPEAT_INTERVAL = 0.30
CENTER_TURN_THRESHOLD    = 80
TURN_ANGLE               = 30

# ========== GLOBALS ==========
session = requests.Session()
latest_frame = None
frame_lock = threading.Lock()
running = True
pickup_in_progress = False
pickup_lock = threading.Lock()
yolo_results = Queue(maxsize=3)
area_buffer = collections.deque(maxlen=15)
pickup_counter = 0
last_move = None
last_move_time = 0

# ========== RPC ==========
def rpc(method, params):
    try:
        session.post(RPC_URL, json={"method": method, "params": params, "jsonrpc": "2.0", "id": 0}, timeout=0.2)
    except Exception as e:
        print(f"RPC error {method}: {e}")

# ========== MOVEMENT ==========
def set_velocity(velocity=0, angle=90):
    global last_move, last_move_time
    now = time.time()
    move_key = (velocity, angle)
    if last_move != move_key or (now - last_move_time > MOVEMENT_REPEAT_INTERVAL):
        print(f"Vel={velocity:2}  Angle={angle:3}°")
        rpc("SetChassisVelocity", [velocity, angle, 0])
        last_move = move_key
        last_move_time = now

def stop():
    set_velocity(0, 90)

# ========== ARM ==========
def move_servo(time_ms, servo_count, *args):
    rpc("SetPWMServo", [time_ms, servo_count, *args])
    time.sleep(time_ms / 1000.0 + 0.3)

def set_initial_arm():
    print("Setting arm to neutral...")
    move_servo(1200, 5, 1, -90, 3, 90, 4, -90, 5, 30, 6, 0)
    print("✓ Arm ready")

def pickup_sequence():
    global pickup_in_progress, pickup_counter
    with pickup_lock:
        if pickup_in_progress: return
        pickup_in_progress = True

    print("\nPICKUP START")
    stop()
    time.sleep(0.8)

    print(" Lowering arm...")
    move_servo(2000, 5, 1, -90, 3, 50, 4, -50, 5, -80, 6, 0)
    move_servo(1300, 1, 1, 110)

    print(" Lifting to bin...")
    move_servo(2000, 5, 1, 0, 3, 0, 4, -40, 5, 75, 6, 0)
    time.sleep(0.5)
    move_servo(1300, 1, 1, -90)

    print(" Returning neutral...")
    move_servo(1500, 5, 1, -90, 3, 90, 4, -90, 5, 30, 6, 0)

    print("PICKUP DONE\n")

    pickup_counter = 0
    area_buffer.clear()

    while not yolo_results.empty():
        try: yolo_results.get_nowait()
        except: pass

    time.sleep(0.7)
    with pickup_lock:
        pickup_in_progress = False

# ========== CAMERA THREAD ==========
def camera_thread():
    global latest_frame, running
    while running:
        cap = cv2.VideoCapture(STREAM_URL)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        print("Camera opened")
        while running:
            ret, frame = cap.read()
            if not ret:
                print("Camera lost → reconnecting...")
                break
            frame = cv2.resize(frame, (DISPLAY_W, DISPLAY_H))
            with frame_lock:
                latest_frame = frame.copy()
            time.sleep(0.025)
        cap.release()
        time.sleep(1.2)

# ========== YOLO THREAD ==========
def yolo_thread():
    model = YOLO(YOLO_MODEL)
    while running:
        if pickup_in_progress:
            time.sleep(0.15)
            continue
        with frame_lock:
            if latest_frame is None:
                time.sleep(0.05)
                continue
            frame = latest_frame.copy()
        try:
            results = model(frame, conf=CONFIDENCE_THRESHOLD, verbose=False)[0]
        except Exception as e:
            print(f"YOLO error: {e}")
            time.sleep(0.3)
            continue
        if yolo_results.full():
            try: yolo_results.get_nowait()
            except: pass
        try: yolo_results.put_nowait(results)
        except: pass
        time.sleep(0.05)

# ========== START ==========
print("Starting threads...")
threading.Thread(target=camera_thread, daemon=True).start()
threading.Thread(target=yolo_thread, daemon=True).start()
time.sleep(3)
set_initial_arm()

print("\n=== AUTONOMOUS TRASH COLLECTOR (no extra centering before pickup) ===")
print(f"Pickup at > {int(PICKUP_RELATIVE_THRESHOLD*100)}% of screen")
# print("=" * 70)

# ========== MAIN LOOP ==========
while running:
    if pickup_in_progress:
        time.sleep(0.08)
        continue

    results = None
    try:
        results = yolo_results.get_nowait()
        while not yolo_results.empty():
            try: yolo_results.get_nowait()
            except: break
    except:
        pass

    detected = False
    max_area = 0
    best_box = None
    best_relative = 0.0

    if results is not None and results.boxes is not None:
        for box in results.boxes:
            conf = float(box.conf)
            if conf < CONFIDENCE_THRESHOLD: continue
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            area = (x2 - x1) * (y2 - y1)
            relative = area / FRAME_AREA
            if relative > MAX_VALID_RELATIVE_AREA: continue
            if area > max_area:
                max_area = area
                best_relative = relative
                best_box = (x1, y1, x2, y2)
                detected = True

    if detected:
        area_buffer.append(max_area)
    else:
        if len(area_buffer) > 0:
            area_buffer.append(int(area_buffer[-1] * 0.88))

    smoothed_area = sum(area_buffer) / len(area_buffer) if area_buffer else 0
    smoothed_relative = smoothed_area / FRAME_AREA

    if smoothed_relative > PICKUP_RELATIVE_THRESHOLD:
        pickup_counter += 1
    else:
        if smoothed_relative < PICKUP_RELATIVE_THRESHOLD * 0.65:
            pickup_counter = 0

    # ── Decision logic (simplified - no extra centering phase) ───────────────
    if pickup_counter >= STABLE_PICKUP_FRAMES and best_box:
        print(f"\n\n PICKUP TRIGGER!  size={int(smoothed_relative*100)}%")
        threading.Thread(target=pickup_sequence, daemon=True).start()
        stop()

    elif detected and smoothed_relative > MOVE_RELATIVE_THRESHOLD and best_box:
        # Normal approach + centering
        x1, y1, x2, y2 = best_box
        box_center_x = (x1 + x2) // 2
        image_center = DISPLAY_W // 2
        offset = box_center_x - image_center

        if offset < -CENTER_TURN_THRESHOLD:
            angle = 120
            speed = 35
        elif offset > CENTER_TURN_THRESHOLD:
            angle = 60
            speed = 35
        else:
            angle = 90
            speed = 45

        set_velocity(speed, angle)
    else:
        stop()

    # Debug print
    print(f" raw={max_area:>6} | rel={best_relative:.3f} | smooth_rel={smoothed_relative:.3f} | "
          f"det={detected} | cnt={pickup_counter:>2} ", end="\r")

    # ── Display ───────────────────────────────────────────────
    with frame_lock:
        if latest_frame is not None:
            disp = latest_frame.copy()

            if best_box:
                x1, y1, x2, y2 = best_box
                color = (0, 0, 255) if smoothed_relative > PICKUP_RELATIVE_THRESHOLD else \
                        (0, 255, 255) if smoothed_relative > PICKUP_RELATIVE_THRESHOLD * 0.6 else \
                        (0, 255, 0)

                cv2.rectangle(disp, (x1, y1), (x2, y2), color, 2)
                cv2.putText(disp, f"{int(smoothed_relative*100)}%", (x1, y1-12),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

                cv2.line(disp, (DISPLAY_W//2, 0), (DISPLAY_W//2, DISPLAY_H), (180, 180, 180), 1)
                box_cx = (x1 + x2) // 2
                cv2.line(disp, (DISPLAY_W//2, DISPLAY_H//2), (box_cx, DISPLAY_H//2),
                         (0, 180, 255), 2)
                cv2.circle(disp, (box_cx, DISPLAY_H//2), 8, (0, 180, 255), -1)

            status_color = (0, 180, 255) if pickup_counter > 0 else (255, 255, 255)
            cv2.putText(disp, f"Pickup in: {max(0, STABLE_PICKUP_FRAMES - pickup_counter)}",
                        (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)

            if pickup_in_progress:
                cv2.putText(disp, "PICKING UP...", (140, 240),
                            cv2.FONT_HERSHEY_DUPLEX, 1.6, (0, 0, 255), 4)

            cv2.imshow("Trash Collector", disp)

    if cv2.waitKey(1) & 0xFF == 27:
        running = False
        break

    time.sleep(0.04)

# ========== CLEANUP ==========
print("\n\nShutting down...")
running = False
stop()
time.sleep(0.8)
set_initial_arm()
cv2.destroyAllWindows()
print("Done.")