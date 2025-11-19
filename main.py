from ultralytics import YOLO
import cv2

# Load your trained YOLO model
model = YOLO("yolo11n.pt")

# Open the webcam (0 is usually the default camera)
cap = cv2.VideoCapture(0)

