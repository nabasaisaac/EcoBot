#!/usr/bin/env python3
# encoding:utf-8
import cv2
import glob
import numpy as np
from CalibrationConfig import *

# Path of captured calibration images
images = glob.glob(save_path + '*.jpg')
for fname in images:
    img = cv2.imread(fname)
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

    # Find the chess board corners
    ret, corners = cv2.findChessboardCorners(gray, (calibration_size[1],calibration_size[0]),None)

    # If found, add object points, image points (after refining them)
    if ret == True:
        objpoints.append(objp)

        corners2 = cv2.cornerSubPix(gray,corners,(11,11),(-1,-1),criteria)
        imgpoints.append(corners2)

        # Draw and display the corners
        img = cv2.drawChessboardCorners(img, (calibration_size[1],calibration_size[0]), corners2,ret)
        cv2.imshow('img',img)
        cv2.waitKey(1)
    else:
        print('Not find object points:', fname)

cv2.destroyAllWindows()