#!/usr/bin/env python3
# encoding:utf-8
import cv2
import time
import numpy as np
from CalibrationConfig import *

# Compute pixel-to-real-world mapping coefficient.
# Press Space to compute/save the parameter. Press Esc to exit.
# Note: The camera frame must fully contain the chessboard, and the crosshair should be centered on the board.

cap = cv2.VideoCapture(-1)

# Load calibration parameters
param_data = np.load(calibration_param_path + '.npz')

# Read intrinsics/distortion params
mtx = param_data['mtx_array']
dist = param_data['dist_array']
