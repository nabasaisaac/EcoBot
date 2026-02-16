import cv2
import time
from ultralytics import YOLO

STREAM_URL = "http://192.168.149.1:8080?action=stream"

FRAME_W = 320
FRAME_H = 240

CENTER_X = FRAME_W // 2

# -----------------------------
# LOAD MODEL
# -----------------------------

model = YOLO("best.pt")

# -----------------------------
# CAMERA
# -----------------------------

cap = cv2.VideoCapture(STREAM_URL)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

time.sleep(2)

if not cap.isOpened():
    print("Camera connection failed")
    exit()

print("Camera ready")

# -----------------------------
# MEMORY VARIABLES
# -----------------------------

last_box = None
lost_frames = 0
MAX_LOST = 8

smooth_x = 0
smooth_y = 0
alpha = 0.7

while True:

    # flush buffer to remove lag
    for _ in range(4):
        cap.grab()

    ret, frame = cap.retrieve()

    if not ret:
        continue

    frame = cv2.resize(frame,(FRAME_W,FRAME_H))

    # -----------------------------
    # YOLO TRACKING
    # -----------------------------

    results = model.track(
        frame,
        persist=True,
        imgsz=320,
        conf=0.5,
        verbose=False
    )

    detection_found = False
    best_box = None
    best_error = 9999

    for r in results:

        if r.boxes is None:
            continue

        boxes = r.boxes.xyxy.cpu().numpy()
        confs = r.boxes.conf.cpu().numpy()

        for box, conf in zip(boxes, confs):

            x1,y1,x2,y2 = map(int,box)

            # remove giant false box
            area = (x2-x1)*(y2-y1)
            if area > FRAME_W*FRAME_H*0.5:
                continue

            cx = (x1+x2)//2
            error = abs(cx - CENTER_X)

            if error < best_error:
                best_error = error
                best_box = (x1,y1,x2,y2,conf)

    # -----------------------------
    # MEMORY SYSTEM
    # -----------------------------

    if best_box is not None:

        last_box = best_box
        lost_frames = 0
        detection_found = True

    else:

        lost_frames += 1


    # -----------------------------
    # USE LAST KNOWN TARGET
    # -----------------------------

    if lost_frames < MAX_LOST and last_box is not None:

        x1,y1,x2,y2,conf = last_box

        cx = (x1+x2)//2
        cy = (y1+y2)//2

        # smoothing
        smooth_x = int(alpha*smooth_x + (1-alpha)*cx)
        smooth_y = int(alpha*smooth_y + (1-alpha)*cy)

        cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)

        cv2.circle(frame,(smooth_x,smooth_y),5,(0,0,255),-1)

        cv2.putText(frame,
                    f"conf:{conf:.2f}",
                    (x1,y1-5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0,255,0),
                    2)

    # draw center reference
    cv2.line(frame,(CENTER_X,0),(CENTER_X,FRAME_H),(255,0,0),2)

    cv2.imshow("Stable Tracking",frame)

    if cv2.waitKey(1)==27:
        break


cap.release()
cv2.destroyAllWindows()