#!/usr/bin/env python3
# encoding:utf-8
import os
import cv2
from CalibrationConfig import *

# Capture calibration images and save them to the calibration_images folder.
# Press Space to save an image, Esc to exit.

cap = cv2.VideoCapture(-1)

# Create the output folder if it does not exist
if not os.path.exists(save_path):
    os.mkdir(save_path)

# Current number of saved images
num = 0
while True:
    ret, frame = cap.read()
    if ret:
        Frame = frame.copy()
        cv2.putText(Frame, str(num), (10, 50), cv2.FONT_HERSHEY_COMPLEX, 2.0, (0, 0, 255), 5)
        cv2.imshow("Frame", Frame)
        key = cv2.waitKey(1)
        if key == 27:
            break
        if key == 32:
            num += 1
            # Filename format: <count>.jpg
            cv2.imwrite(save_path + str(num) + ".jpg", frame) 

cap.release()
cv2.destroyAllWindows()
