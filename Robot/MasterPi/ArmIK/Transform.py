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

