import pygame
import requests
import time

# ================= CONFIG =================

ROBOT_IP = "172.20.10.8"
RPC_URL = f"http://{ROBOT_IP}:9030/jsonrpc"

# ================= RPC =================

session = requests.Session()

def rpc(method, params):
    payload = {
        "method": method,
        "params": params,
        "jsonrpc": "2.0",
        "id": 0
    }
    
    try:
        r = session.post(RPC_URL, json=payload, timeout=0.5)
        print(f"Response: {r.json()}")
        return r.json()
    except Exception as e:
        print(f"RPC Error: {e}")
        return None

# ================= ARM CONTROL =================

def move_servo(time_ms, servo_count, *args):
    """Move servos with timing"""
    print(f"Moving: time={time_ms}ms, servos={servo_count}, args={args}")
    rpc("SetPWMServo", [time_ms, servo_count, *args])
    time.sleep(time_ms/1000 + 0.2)

def set_servo_position(servo_id, position):
    """Move a single servo to a position"""
    # Clamp position to valid range
    if servo_id == 6:  # Base - range 6 to -90
        position = max(-90, min(90, position))
        print(f"Servo {servo_id} (Base) -> {position}")
    elif servo_id == 1:  # Gripper - range 6 to -90
        position = max(-90, min(6, position))
        print(f"Servo {servo_id} (Gripper) -> {position}")
    else:  # Other servos: -90 to 90
        position = max(-90, min(90, position))
        print(f"Servo {servo_id} -> {position}")
    
    move_servo(100, 1, servo_id, position)

def gripper_open():
    """Fully open gripper - goes to 6"""
    print("Gripper OPEN")
    move_servo(500, 1, 1, 6)

def gripper_close():
    """Fully close gripper - goes to -90"""
    print("Gripper CLOSE")
    move_servo(500, 1, 1, -90)

def default_pose():
    """Return to default position"""
    print("\n=== DEFAULT POSE ===")
    move_servo(1500, 6,
         1, 0,    # Gripper
         3, 90,   # ID3
         4, -90,  # ID4
         5, 50,   # ID5
         6, 0)    # Base
    print("Default pose complete\n")

# ================= CONTROLLER SETUP =================

pygame.init()
pygame.joystick.init()

if pygame.joystick.get_count() == 0:
    print("No controller found!")
    exit()

joy = pygame.joystick.Joystick(0)
joy.init()

print(f"\nController: {joy.get_name()}")
print(f"Buttons: {joy.get_numbuttons()}")
print(f"Axes: {joy.get_numaxes()}")
print(f"Hats: {joy.get_numhats()}")

# ================= SERVO POSITIONS =================
servo_positions = {
    1: 0,   # Gripper (D-pad Left/Right)
    3: 90,  # ID3 (D-pad Up/Down)
    4: -90, # ID4 (Right stick Left/Right)
    5: 50,  # ID5 (Right stick Up/Down) - SWAPPED
    6: 0    # ID6 Base (LT/RT) - SWAPPED CONTROLS
}

# Gripper state
gripper_open_state = True  # Start open

# ================= MAIN LOOP =================

print("\n" + "="*60)
print("SERVO TEST CONTROLS - FINAL FIX")
print("="*60)
print("\n=== SERVO MAPPING ===")
print("ID6 (Base):      LT (Right) / RT (Left) - SWAPPED")
print("                  LEFT works, RIGHT now goes to negative values")
print("ID5 (Elbow):     Right Stick Up/Down - SWAPPED (Up goes down, Down goes up)")
print("ID4 (Shoulder):  Right Stick Left/Right")
print("ID3:             D-pad Up/Down")
print("ID1 (Gripper):   D-pad Left (Open) / Right (Close) - INSTANT")
print("\nPress A for default pose, Start to exit")
print("="*60 + "\n")

# Move to default pose first
default_pose()

# Tracking previous values
prev_values = {
    'dpad_x': 0,
    'dpad_y': 0,
    'axis_2': 0,  # Right stick X
    'axis_3': 0,  # Right stick Y
    'axis_4': 0,  # Left trigger
    'axis_5': 0   # Right trigger
}

running = True
deadzone = 0.2

try:
    while running:
        pygame.event.pump()
        
        # Check for exit
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        
        if joy.get_button(7):  # Start button
            print("\nExiting...")
            running = False
            break
        
        if joy.get_button(0):  # A button - default pose
            default_pose()
            # Reset position tracking
            servo_positions[3] = 90
            servo_positions[4] = -90
            servo_positions[5] = 50
            servo_positions[6] = 0
            gripper_open_state = True
            time.sleep(0.5)
        
        # ========== READ CONTROLS ==========
        
        # D-pad
        dpad = joy.get_hat(0)
        dpad_x, dpad_y = dpad
        
        # Right Stick
        right_x = joy.get_axis(2)
        right_y = joy.get_axis(3)
        
        # Triggers (LT/RT) - values from -1 to 1
        left_trigger = joy.get_axis(4)  # LT
        right_trigger = joy.get_axis(5)  # RT
        
        # Apply deadzone to right stick
        if abs(right_x) < deadzone:
            right_x = 0
        if abs(right_y) < deadzone:
            right_y = 0
        
        # ========== ID1: GRIPPER (D-pad Left/Right) ==========
        if dpad_x != prev_values['dpad_x']:
            if dpad_x > 0:  # D-pad Right - CLOSE gripper
                if gripper_open_state:
                    gripper_close()
                    gripper_open_state = False
                    print("GRIPPER CLOSED")
            elif dpad_x < 0:  # D-pad Left - OPEN gripper
                if not gripper_open_state:
                    gripper_open()
                    gripper_open_state = True
                    print("GRIPPER OPENED")
            prev_values['dpad_x'] = dpad_x
        
        # ========== ID6: BASE (LT/RT) - SWAPPED CONTROLS ==========
        # LT now moves base RIGHT (towards -90)
        if abs(left_trigger - prev_values['axis_4']) > 0.05:
            if left_trigger > -0.8:  # LT pressed
                move_amount = int((left_trigger + 1) * 25)  # Increased for more range
                # LT = RIGHT = towards -90 (negative direction)
                new_pos = servo_positions[6] - move_amount
                servo_positions[6] = max(-90, min(90, new_pos))
                set_servo_position(6, servo_positions[6])
                print(f"BASE RIGHT (LT) -> {servo_positions[6]}")
            prev_values['axis_4'] = left_trigger
        
        # RT now moves base LEFT (towards 6)
        if abs(right_trigger - prev_values['axis_5']) > 0.05:
            if right_trigger > -0.8:  # RT pressed
                move_amount = int((right_trigger + 1) * 20)
                # RT = LEFT = towards 6 (positive direction)
                new_pos = servo_positions[6] + move_amount
                servo_positions[6] = max(-90, min(90, new_pos))
                set_servo_position(6, servo_positions[6])
                print(f"BASE LEFT (RT) -> {servo_positions[6]}")
            prev_values['axis_5'] = right_trigger
        
        # ========== ID5: ELBOW (Right Stick Up/Down) - SWAPPED ==========
        if abs(right_y - prev_values['axis_3']) > 0.1:
            if abs(right_y) > deadzone:
                move_amount = int(right_y * 30)
                new_pos = servo_positions[5] + move_amount
                servo_positions[5] = max(-90, min(90, new_pos))
                set_servo_position(5, servo_positions[5])
                direction = "DOWN" if right_y < 0 else "UP"
                print(f"ID5 {direction} -> {servo_positions[5]}")
            prev_values['axis_3'] = right_y
        
        # ========== ID4: SHOULDER (Right Stick Left/Right) ==========
        if abs(right_x - prev_values['axis_2']) > 0.1:
            if abs(right_x) > deadzone:
                move_amount = int(right_x * 30)
                new_pos = servo_positions[4] + move_amount
                servo_positions[4] = max(-90, min(90, new_pos))
                set_servo_position(4, servo_positions[4])
                direction = "RIGHT" if right_x > 0 else "LEFT"
                print(f"ID4 {direction} -> {servo_positions[4]}")
            prev_values['axis_2'] = right_x
        
        # ========== ID3: D-pad Up/Down ==========
        if dpad_y != prev_values['dpad_y']:
            if dpad_y > 0:  # D-pad Up
                servo_positions[3] = min(90, servo_positions[3] + 10)
                set_servo_position(3, servo_positions[3])
                print(f"ID3 UP -> {servo_positions[3]}")
            elif dpad_y < 0:  # D-pad Down
                servo_positions[3] = max(-90, servo_positions[3] - 10)
                set_servo_position(3, servo_positions[3])
                print(f"ID3 DOWN -> {servo_positions[3]}")
            prev_values['dpad_y'] = dpad_y
        
        # ========== DISPLAY CURRENT POSITIONS ==========
        gripper_status = "OPEN " if gripper_open_state else "CLOSE"
        print(f"\rGrip:{gripper_status} | ID3:{servo_positions[3]:3d} | ID4:{servo_positions[4]:3d} | ID5:{servo_positions[5]:3d} | ID6(Base):{servo_positions[6]:3d} | LT:{left_trigger:.2f} RT:{right_trigger:.2f}", end="")
        
        time.sleep(0.05)

except KeyboardInterrupt:
    print("\n\nInterrupted by user")

finally:
    print("\n\nReturning to default pose...")
    default_pose()
    pygame.quit()
    print("Test complete!")