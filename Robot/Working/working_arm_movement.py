import requests
import time

ROBOT_IP = "172.20.10.8"
URL = f"http://{ROBOT_IP}:9030/jsonrpc"

session = requests.Session()

# -----------------------------
# RPC FUNCTION
# -----------------------------

def rpc(method, params):

    payload = {
        "method": method,
        "params": params,
        "jsonrpc": "2.0",
        "id": 0
    }

    r = session.post(URL, json=payload)
    print(r.text)


# -----------------------------
# MOVE SERVO FUNCTION
# -----------------------------

def move(time_ms, servo_count, *args):

    rpc("SetPWMServo",[time_ms, servo_count, *args])

    time.sleep(time_ms/1000 + 0.4)


print("Pickup Simulation Starting")
time.sleep(1)

# -----------------------------
# Neutral pose
# -----------------------------

print("Neutral pose")

move(1000,5,
     1,0,
     3,90,
     4,-90,
     5,50,
     6,0)


# -----------------------------
# Move arm to trash
# -----------------------------

print("Move arm to trash")

move(1500,5,
     1,-90,
     3,50,
     4,-30,
     5,-90,
     6,0)


# -----------------------------
# Close gripper
# -----------------------------

print("Grab trash")

move(1000,1,
     1,90)


# -----------------------------
# Move arm to back (bin)
# -----------------------------

print("Move to bin")

move(1500,5,
     1,0,
     3,-90,
     4,-50,
     5,50,
     6,0)


# -----------------------------
# Open gripper (drop trash)
# -----------------------------

print("Release trash")

move(1000,1,
     1,-90)


# -----------------------------
# Return to neutral
# -----------------------------

print("Return home")

move(1000,5,
     1,0,
     3,90,
     4,-90,
     5,50,
     6,90)


print("Pickup simulation complete")