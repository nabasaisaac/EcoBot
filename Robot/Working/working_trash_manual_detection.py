import pygame
import requests
import time
import cv2
import threading
import numpy as np
from queue import Queue
from ultralytics import YOLO

# ================= CONFIG =================

ROBOT_IP = "172.20.10.8"
RPC_URL = f"http://{ROBOT_IP}:9030/jsonrpc"
STREAM_URL = f"http://{ROBOT_IP}:8080?action=stream"

DISPLAY_W = 640
DISPLAY_H = 480

# YOLO Configuration - USING YOUR CUSTOM MODEL
YOLO_MODEL = "best.pt"  # Your trained trash detection model
YOLO_CONF = 0.5  # Confidence threshold
YOLO_FRAME_SKIP = 3  # Process every 3rd frame

# ================= GLOBALS =================

session = requests.Session()

sonar_cm = 0
movement_commands = 0
latest_frame = None
frame_lock = threading.Lock()
pickup_running = False
pickup_lock = threading.Lock()
running = True

# YOLO Globals
yolo_results = []
yolo_lock = threading.Lock()
frame_counter = 0
last_frame_shape = None  # (H, W) of last frame passed to YOLO (for max bbox filter)
MAX_BBOX_AREA_RATIO = 0.45  # Skip detections larger than 45% of frame (false full-screen paper)

# Auto-targeting state
auto_mode = False
target_class = None  # Will be set to your trash classes
current_target = None

# ================= RPC =================

def rpc(method, params):
    payload = {
        "method": method,
        "params": params,
        "jsonrpc": "2.0",
        "id": 0
    }
    
    try:
        r = session.post(RPC_URL, json=payload, timeout=0.5)
        return r.json()
    except Exception as e:
        print(f"RPC Error: {e}")
        return None

# ================= SONAR =================

def sonar_thread():
    global sonar_cm, running
    
    while running:
        try:
            r = rpc("GetSonarDistance", [])
            
            if r and "result" in r:
                try:
                    sonar_cm = int(r["result"][1] / 10)
                except:
                    pass
        except:
            pass
        
        time.sleep(0.2)

# ================= YOLO THREAD (Using your best.pt) =================

def yolo_thread():
    """Run YOLO detection in separate thread using your custom model"""
    global yolo_results, latest_frame, frame_counter, running, last_frame_shape
    
    print("Loading your custom trash detection model (best.pt)...")
    try:
        # Load your custom trained model
        model = YOLO(YOLO_MODEL)
        print("✓ Custom model loaded successfully!")
        
        # Print the classes your model detects
        class_names = model.names
        print(f"Your model detects these trash classes: {class_names}")
        
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Make sure best.pt is in the same folder as this script")
        return
    
    while running:
        with frame_lock:
            if latest_frame is not None:
                # Make a copy to process
                frame_to_process = latest_frame.copy()
                current_frame_num = frame_counter
                last_frame_shape = frame_to_process.shape[:2]  # (H, W) for area filter
            else:
                time.sleep(0.03)
                continue

        # Process every Nth frame to maintain speed
        if current_frame_num % YOLO_FRAME_SKIP == 0:
            last_frame_shape = frame_to_process.shape[:2]  # (H,W) for max bbox filter (global)
            # Run YOLO detection with your custom model
            results = model(frame_to_process, conf=YOLO_CONF, verbose=False)

            # Store results
            with yolo_lock:
                yolo_results = results[0]
        
        time.sleep(0.01)

def get_detected_objects():
    """Get list of detected trash objects. Skips oversized boxes (false full-screen paper)."""
    global last_frame_shape
    with yolo_lock:
        if yolo_results and hasattr(yolo_results, 'boxes') and len(yolo_results.boxes) > 0:
            objects = []
            frame_area = None
            if last_frame_shape is not None:
                frame_area = last_frame_shape[0] * last_frame_shape[1]
                max_area = frame_area * MAX_BBOX_AREA_RATIO
            for box in yolo_results.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                area = (int(x2) - int(x1)) * (int(y2) - int(y1))
                if frame_area is not None and area > max_area:
                    continue  # Skip false detection covering most of screen (e.g. paper)
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                name = yolo_results.names[cls]
                objects.append({
                    'name': name,
                    'conf': conf,
                    'bbox': (int(x1), int(y1), int(x2), int(y2)),
                    'center': ((int(x1) + int(x2)) // 2, (int(y1) + int(y2)) // 2),
                    'area': area
                })
            return objects
    return []

def get_closest_trash(target_class=None):
    """Find the closest trash item (largest in frame = closest to camera)"""
    objects = get_detected_objects()
    if not objects:
        return None
    
    # Filter by class if specified
    if target_class and target_class != "any":
        objects = [obj for obj in objects if obj['name'] == target_class]
        if not objects:
            return None
    
    # Find object with largest area (closest to camera)
    if objects:
        largest = max(objects, key=lambda obj: obj['area'])
        return largest
    return None

def get_trash_classes():
    """Get all classes your model detects"""
    with yolo_lock:
        if yolo_results and hasattr(yolo_results, 'names'):
            return yolo_results.names
    return {}

# ================= CAMERA =================

def camera_thread():
    global latest_frame, running, frame_counter
    
    cap = cv2.VideoCapture(STREAM_URL)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    
    if not cap.isOpened():
        print("Failed to open camera stream!")
        return
    
    while running:
        try:
            ret, frame = cap.read()
            
            if ret:
                with frame_lock:
                    latest_frame = frame.copy()
                    frame_counter += 1
            else:
                print("Camera read failed, reconnecting...")
                cap.release()
                time.sleep(1)
                cap = cv2.VideoCapture(STREAM_URL)
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        except Exception as e:
            print(f"Camera error: {e}")
            time.sleep(0.1)
    
    cap.release()

# ================= MOVEMENT =================

def move(angle):
    global movement_commands
    
    if angle == 270:
        cmd_angle = -90
    else:
        cmd_angle = angle
    
    rpc("SetMovementAngle", [cmd_angle])
    movement_commands += 1

def stop():
    rpc("SetMovementAngle", [-1])

# ================= ROTATION =================

def rotate_left():
    rpc("SetBrushMotor", [1, -40, 2, 40, 3, -40, 4, 40])

def rotate_right():
    rpc("SetBrushMotor", [1, 40, 2, -40, 3, 40, 4, -40])

def stop_rotation():
    rpc("SetBrushMotor", [1, 0, 2, 0, 3, 0, 4, 0])

# ================= ARM (from Working_arm_XboxControl.py) =================

def move_servo(time_ms, servo_count, *args):
    rpc("SetPWMServo", [time_ms, servo_count, *args])
    time.sleep(time_ms/1000 + 0.2)

def set_servo_position(servo_id, position):
    """Move a single servo. Clamp to valid range per servo."""
    if servo_id == 6:  # Base
        position = max(-90, min(90, position))
    elif servo_id == 1:  # Gripper
        position = max(-90, min(6, position))
    else:
        position = max(-90, min(90, position))
    move_servo(100, 1, servo_id, position)

def gripper_open():
    """Fully open gripper (same as Working_arm_XboxControl)"""
    move_servo(500, 1, 1, 6)

def gripper_close():
    """Fully close gripper (same as Working_arm_XboxControl)"""
    move_servo(500, 1, 1, -90)

def default_pose():
    print("Moving to default pose...")
    move_servo(1000, 6,
         1, 0,
         3, 90,
         4, -90,
         5, 50,
         6, 0)
    print("Default pose complete")

def pickup_sequence():
    global pickup_running
    
    print("\n=== PICKUP SEQUENCE STARTED ===")
    
    try:
        stop()
        stop_rotation()
        time.sleep(0.5)
        
        move_servo(1500, 5, 1, -90, 3, 50, 4, -30, 5, -90, 6, 0)
        time.sleep(0.5)
        move_servo(1000, 1, 1, 90)
        time.sleep(0.5)
        move_servo(1500, 5, 1, 0, 3, -90, 4, -50, 5, 50, 6, 0)
        time.sleep(0.5)
        move_servo(1000, 1, 1, -90)
        time.sleep(0.5)
        default_pose()
        
        print("=== PICKUP SEQUENCE COMPLETE ===\n")
    except Exception as e:
        print(f"Pickup error: {e}")
    finally:
        with pickup_lock:
            pickup_running = False

# ================= AUTO-TARGETING FUNCTIONS =================

def auto_align_to_trash(trash_object):
    """Automatically rotate to center trash in frame"""
    if not trash_object:
        return False
    
    frame_center_x = DISPLAY_W // 2
    obj_center_x = trash_object['center'][0]
    
    # Calculate error (how far from center)
    error = obj_center_x - frame_center_x
    threshold = 50  # Pixels
    
    if abs(error) > threshold:
        if error > 0:
            rotate_right()
        else:
            rotate_left()
        return False  # Not aligned yet
    else:
        stop_rotation()
        return True  # Aligned!

def auto_approach_trash(trash_object, min_distance_cm=20):
    """Automatically drive towards trash until close enough"""
    if not trash_object:
        stop()
        return False
    
    # Use object area as proxy for distance
    # Larger area = closer to camera
    area = trash_object['area']
    
    # Adjust these thresholds based on testing
    # You may need to calibrate these values
    target_area = 30000  # When trash fills this area, stop
    
    # Also use sonar for safety
    if area < target_area and sonar_cm > min_distance_cm:
        move(90)  # Move forward
        return False
    else:
        stop()
        return True

def search_for_trash():
    """Rotate slowly to search for trash when none is visible"""
    if not get_detected_objects():
        rotate_right()  # Slowly scan
        return True
    return False

# ================= CONTROLLER SETUP =================

pygame.init()
pygame.joystick.init()

if pygame.joystick.get_count() == 0:
    print("No controller found!")
    exit()

joy = pygame.joystick.Joystick(0)
joy.init()

print(f"Controller: {joy.get_name()}")
print(f"Number of buttons: {joy.get_numbuttons()}")
print(f"Number of axes: {joy.get_numaxes()}")

# ================= START THREADS =================

# Start sonar thread
sonar_thread_handle = threading.Thread(target=sonar_thread, daemon=True)
sonar_thread_handle.start()

# Start camera thread
camera_thread_handle = threading.Thread(target=camera_thread, daemon=True)
camera_thread_handle.start()

# Start YOLO thread with your custom model
yolo_thread_handle = threading.Thread(target=yolo_thread, daemon=True)
yolo_thread_handle.start()

# ================= INITIALIZE ARM =================

print("Initializing robot...")
default_pose()
time.sleep(2)

last_move = None
last_rotation = None

# Arm servo positions (from Working_arm_XboxControl) – D-pad, right stick, triggers
servo_positions = {
    1: 0,   # Gripper (D-pad Left/Right)
    3: 90,  # ID3 (D-pad Up/Down)
    4: -90, # ID4 Shoulder (Right stick Left/Right)
    5: 50,  # ID5 Elbow (Right stick Up/Down)
    6: 0    # ID6 Base (LT/RT)
}
arm_prev = {'dpad_x': 0, 'dpad_y': 0, 'axis_2': 0, 'axis_3': 0, 'axis_4': 0, 'axis_5': 0}
gripper_open_state = True

# Auto-targeting flags
auto_mode = False
target_class = "any"  # Default to any trash

# ================= MAIN LOOP =================

print("\n=== CONTROLS ===")
print("Left Stick: Move | LB/RB: Rotate")
print("D-pad: Gripper L/R open/close, U/D = ID3 | Right stick: ID4 shoulder, ID5 elbow")
print("LT/RT: Base (ID6) | Back: Default pose | A: Pickup | B: Auto-mode | X: Target any | Y: Classes | Start: Exit")
print("================\n")

# Store trash classes for display
trash_classes = {}

try:
    while running:
        pygame.event.pump()
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                break
        
        if not running:
            break
        
        # Get trash classes for display
        if not trash_classes:
            trash_classes = get_trash_classes()
        
        # ========== AUTO MODE HANDLING ==========
        if auto_mode:
            # In auto mode, find and approach trash
            current_target = get_closest_trash(target_class)
            
            if current_target:
                # First align, then approach
                if auto_align_to_trash(current_target):
                    if auto_approach_trash(current_target):
                        # Close enough to pickup? Maybe auto-pickup later
                        pass
                
                # Draw target info later
            else:
                # No trash found, stop moving and rotate to search
                if last_move is not None:
                    stop()
                    last_move = None
                search_for_trash()
        else:
            # ========== MANUAL MODE ==========
            
            # Check for auto-mode toggle
            if joy.get_button(1):  # B button
                auto_mode = not auto_mode
                if auto_mode:
                    print("🚮 AUTO-TRASH MODE ENABLED")
                    stop_rotation()
                else:
                    print("MANUAL MODE ENABLED")
                    stop_rotation()
                time.sleep(0.3)  # Debounce
            
            # Set target to any trash
            if joy.get_button(2):  # X button
                target_class = "any"
                print("🎯 Targeting: ALL TRASH")
                time.sleep(0.2)
            
            # Show detected classes
            if joy.get_button(3):  # Y button
                objects = get_detected_objects()
                if objects:
                    detected = set([obj['name'] for obj in objects])
                    print(f"Currently seeing: {detected}")
                else:
                    print("No trash detected")
                time.sleep(0.2)
            
            # ========== MOVEMENT CONTROL ==========
            x = joy.get_axis(0)
            y = joy.get_axis(1)
            
            if abs(x) < 0.2:
                x = 0
            if abs(y) < 0.2:
                y = 0
            
            angle = None
            
            # 4 directions only
            if abs(x) > abs(y):
                if x > 0.3:  # Right
                    angle = 0
                elif x < -0.3:  # Left
                    angle = 180
            else:
                if y > 0.3:  # Backward
                    angle = 270
                elif y < -0.3:  # Forward
                    angle = 90
            
            if angle is not None:
                if angle != last_move:
                    move(angle)
                    last_move = angle
            else:
                if last_move is not None:
                    stop()
                    last_move = None
            
            # ========== ROTATION CONTROL ==========
            if joy.get_button(4):  # LB
                if last_rotation != "left":
                    rotate_left()
                    last_rotation = "left"
            elif joy.get_button(5):  # RB
                if last_rotation != "right":
                    rotate_right()
                    last_rotation = "right"
            else:
                if last_rotation is not None:
                    stop_rotation()
                    last_rotation = None

            # ========== ARM CONTROL (from Working_arm_XboxControl) ==========
            deadzone = 0.2
            if joy.get_numhats() > 0:
                dpad = joy.get_hat(0)
                dpad_x, dpad_y = dpad
                # Gripper: D-pad Left = open, Right = close
                if dpad_x != arm_prev['dpad_x']:
                    if dpad_x > 0:
                        gripper_close()
                        gripper_open_state = False
                    elif dpad_x < 0:
                        gripper_open()
                        gripper_open_state = True
                    arm_prev['dpad_x'] = dpad_x
                # ID3: D-pad Up/Down
                if dpad_y != arm_prev['dpad_y']:
                    if dpad_y > 0:
                        servo_positions[3] = min(90, servo_positions[3] + 10)
                        set_servo_position(3, servo_positions[3])
                    elif dpad_y < 0:
                        servo_positions[3] = max(-90, servo_positions[3] - 10)
                        set_servo_position(3, servo_positions[3])
                    arm_prev['dpad_y'] = dpad_y
            # Right stick: axis 2 = ID4 shoulder, axis 3 = ID5 elbow (only on change)
            if joy.get_numaxes() > 3:
                right_x = joy.get_axis(2)
                right_y = joy.get_axis(3)
                if abs(right_x - arm_prev['axis_2']) > 0.1 and abs(right_x) > deadzone:
                    move_amount = int(right_x * 30)
                    servo_positions[4] = max(-90, min(90, servo_positions[4] + move_amount))
                    set_servo_position(4, servo_positions[4])
                    arm_prev['axis_2'] = right_x
                if abs(right_y - arm_prev['axis_3']) > 0.1 and abs(right_y) > deadzone:
                    move_amount = int(right_y * 30)
                    servo_positions[5] = max(-90, min(90, servo_positions[5] + move_amount))
                    set_servo_position(5, servo_positions[5])
                    arm_prev['axis_3'] = right_y
            # Base ID6: LT (axis 4) = right, RT (axis 5) = left (only on change)
            if joy.get_numaxes() > 5:
                lt = joy.get_axis(4)
                rt = joy.get_axis(5)
                if abs(lt - arm_prev['axis_4']) > 0.05 and lt > -0.8:
                    move_amount = int((lt + 1) * 25)
                    servo_positions[6] = max(-90, min(90, servo_positions[6] - move_amount))
                    set_servo_position(6, servo_positions[6])
                    arm_prev['axis_4'] = lt
                if abs(rt - arm_prev['axis_5']) > 0.05 and rt > -0.8:
                    move_amount = int((rt + 1) * 20)
                    servo_positions[6] = max(-90, min(90, servo_positions[6] + move_amount))
                    set_servo_position(6, servo_positions[6])
                    arm_prev['axis_5'] = rt

        # ========== ARM: Back button = default pose ==========
        if joy.get_button(6):  # Back
            default_pose()
            servo_positions[3], servo_positions[4] = 90, -90
            servo_positions[5], servo_positions[6] = 50, 0
            gripper_open_state = True
            time.sleep(0.5)

        # ========== PICKUP CONTROL ==========
        if joy.get_button(0):  # A button
            with pickup_lock:
                if not pickup_running:
                    pickup_running = True
                    print("🤖 Starting pickup sequence...")
                    threading.Thread(target=pickup_sequence, daemon=True).start()
        
        # ========== EXIT CONTROL ==========
        if joy.get_button(7):  # Start button
            print("Exit button pressed")
            running = False
            break
        
        # ========== DISPLAY WITH TRASH DETECTION ==========
        with frame_lock:
            if latest_frame is not None:
                # Resize for display
                display_frame = cv2.resize(latest_frame, (DISPLAY_W, DISPLAY_H))
                
                # Draw YOLO detections (trash items)
                objects = get_detected_objects()
                for obj in objects:
                    x1, y1, x2, y2 = obj['bbox']
                    name = obj['name']
                    conf = obj['conf']
                    
                    # Scale coordinates to display size
                    scale_x = DISPLAY_W / latest_frame.shape[1]
                    scale_y = DISPLAY_H / latest_frame.shape[0]
                    
                    x1, x2 = int(x1 * scale_x), int(x2 * scale_x)
                    y1, y2 = int(y1 * scale_y), int(y2 * scale_y)
                    
                    # Color based on mode and if it's the current target
                    color = (0, 255, 0)  # Default green
                    
                    if auto_mode and current_target and obj['center'] == current_target['center']:
                        color = (0, 255, 255)  # Yellow for current target
                        
                        # Draw crosshair on target
                        center_x = (x1 + x2) // 2
                        center_y = (y1 + y2) // 2
                        cv2.line(display_frame, 
                                (center_x - 15, center_y), 
                                (center_x + 15, center_y), 
                                (0, 255, 255), 2)
                        cv2.line(display_frame, 
                                (center_x, center_y - 15), 
                                (center_x, center_y + 15), 
                                (0, 255, 255), 2)
                        
                        # Add distance estimate
                        distance_estimate = "CLOSE" if obj['area'] > 20000 else "FAR"
                        cv2.putText(display_frame,
                                   distance_estimate,
                                   (center_x - 30, center_y - 30),
                                   cv2.FONT_HERSHEY_SIMPLEX,
                                   0.5,
                                   (0, 255, 255),
                                   2)
                    elif name == "bottle" or name == "can":  # Add your specific trash types
                        color = (0, 255, 0)  # Green for recyclables
                    else:
                        color = (0, 165, 255)  # Orange for other trash
                    
                    # Draw bounding box
                    cv2.rectangle(display_frame, (x1, y1), (x2, y2), color, 2)
                    
                    # Add label with confidence
                    label = f"{name} {conf:.2f}"
                    
                    # Get text size for background
                    (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
                    cv2.rectangle(display_frame, (x1, y1 - text_h - 5), (x1 + text_w, y1), color, -1)
                    cv2.putText(display_frame,
                               label,
                               (x1, y1 - 5),
                               cv2.FONT_HERSHEY_SIMPLEX,
                               0.5,
                               (255, 255, 255),
                               2)
                
                # Add info overlays
                cv2.putText(display_frame,
                           f"Sonar: {sonar_cm} cm",
                           (10, 20),
                           cv2.FONT_HERSHEY_SIMPLEX,
                           0.5,
                           (0, 255, 255),
                           2)
                
                cv2.putText(display_frame,
                           f"Trash detected: {len(objects)}",
                           (10, 40),
                           cv2.FONT_HERSHEY_SIMPLEX,
                           0.5,
                           (0, 255, 0),
                           2)
                
                # Show mode
                mode_color = (0, 255, 0) if not auto_mode else (0, 255, 255)
                mode_text = f"Mode: {'🚮 AUTO-TRASH' if auto_mode else 'MANUAL'}"
                cv2.putText(display_frame,
                           mode_text,
                           (10, 60),
                           cv2.FONT_HERSHEY_SIMPLEX,
                           0.5,
                           mode_color,
                           2)
                
                if auto_mode:
                    status = "SEARCHING" if not current_target else "TARGET LOCKED"
                    status_color = (0, 0, 255) if not current_target else (0, 255, 255)
                    cv2.putText(display_frame,
                               f"Status: {status}",
                               (10, 80),
                               cv2.FONT_HERSHEY_SIMPLEX,
                               0.5,
                               status_color,
                               2)
                
                if pickup_running:
                    cv2.putText(display_frame,
                               "🤖 PICKUP IN PROGRESS",
                               (10, 200),
                               cv2.FONT_HERSHEY_SIMPLEX,
                               0.7,
                               (0, 0, 255),
                               2)
                
                # Show current direction
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
                
                cv2.putText(display_frame,
                           f"Dir: {direction}",
                           (10, 100),
                           cv2.FONT_HERSHEY_SIMPLEX,
                           0.5,
                           (255, 255, 255),
                           2)
                
                # Show detected classes legend
                if trash_classes:
                    y_pos = 120
                    cv2.putText(display_frame,
                               "Detects:",
                               (10, y_pos),
                               cv2.FONT_HERSHEY_SIMPLEX,
                               0.4,
                               (200, 200, 200),
                               1)
                    for i, (idx, name) in enumerate(trash_classes.items()):
                        if i < 3:  # Show first 3 classes to avoid clutter
                            y_pos += 15
                            cv2.putText(display_frame,
                                       f"- {name}",
                                       (15, y_pos),
                                       cv2.FONT_HERSHEY_SIMPLEX,
                                       0.4,
                                       (150, 150, 150),
                                       1)
                
                cv2.imshow("Trash Collection Robot", display_frame)
        
        # Handle OpenCV window events
        key = cv2.waitKey(1) & 0xFF
        if key == 27:  # ESC key
            running = False
            break
        
        time.sleep(0.01)

except KeyboardInterrupt:
    print("\nInterrupted by user")
except Exception as e:
    print(f"Error in main loop: {e}")

finally:
    # ========== CLEANUP ==========
    print("\nShutting down...")
    running = False
    
    # Stop robot
    stop()
    stop_rotation()
    time.sleep(0.5)
    
    # Return to default pose
    default_pose()
    
    # Clean up
    pygame.quit()
    cv2.destroyAllWindows()
    
    print("Shutdown complete")