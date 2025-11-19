from ultralytics import YOLO
import cv2

# Load your trained YOLO model
model = YOLO("yolo11n.pt")

# Open the webcam (0 is usually the default camera)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()


# Release the camera and close windows
cap.release()
cv2.destroyAllWindows()
