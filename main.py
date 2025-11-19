from ultralytics import YOLO
import cv2

# Load your trained YOLO model
model = YOLO("yolo11n.pt")

# Open the webcam (0 is usually the default camera)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

# Create a fullscreen window
cv2.namedWindow("YOLO Face & Fingers Detection", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("YOLO Face & Fingers Detection", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Run YOLO detection on the frame
    results = model(frame)

    # Annotate frame with detected objects
    annotated_frame = results[0].plot()

    # Show the annotated frame in fullscreen
    cv2.imshow("YOLO Face & Fingers Detection", annotated_frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()
