from ultralytics import YOLO
import cv2

# Load model
model = YOLO(r"./yolo_weights/yolov8n.pt")

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame.")
        break

    # Flip camera horizontally (mirror effect)
    frame = cv2.flip(frame, 1)

    # YOLO detection
    results = model(frame)
    annotated = results[0].plot()

    cv2.namedWindow("Webcam Detection", cv2.WINDOW_NORMAL)
    cv2.imshow("Webcam Detection", annotated)

    # Quit with q
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
