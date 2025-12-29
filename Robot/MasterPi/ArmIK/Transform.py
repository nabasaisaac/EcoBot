#!/usr/bin/env python3
# encoding:utf-8
import cv2
import sys
sys.path.append('/home/pi/MasterPi/')
import math
import numpy as np
from CameraCalibration.CalibrationConfig import *

# Robot arm origin (gimbal center) offset from the camera frame center (cm)
image_center_distance = 20

# Load pixel-to-world mapping parameter
param_data = np.load(map_param_path + '.npz')

# Real-world distance represented by one pixel
map_param_ = param_data['map_param']

# Numeric mapping: map a value from one range to another.
def leMap(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

# Convert image pixel coordinates to the arm coordinate system.
# Example input: (x, y, (width, height)) such as (100, 100, (640, 320)).
def convertCoordinate(x, y, size):
    x = leMap(x, 0, size[0], 0, 640)
    x = x - 320
    x_ = round(x * map_param_, 2)

    y = leMap(y, 0, size[1], 0, 480)
    y = 240 - y
    y_ = round(y * map_param_ + image_center_distance, 2)

    return x_, y_