#!/usr/bin/python3
# coding=utf8
import sys
sys.path.append('/home/pi/MasterPi/')
import cv2
import math
import time
import Camera
import numpy as np
import yaml_handle

# LAB threshold calibration helper (used by vision modes)
if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)

range_rgb = {
    'red': (0, 0, 255),
    'blue': (255, 0, 0),
    'green': (0, 255, 0),
    'black': (0, 0, 0),
    'white': (255, 255, 255),
}

__target_color = ('red',)
def setLABValue(lab_value):
    global lab_data
    global __target_color
    
    __target_color = (lab_value[0]['color'], )
    lab_data[__target_color[0]]['min'][0] = lab_value[0]['min'][0]
    lab_data[__target_color[0]]['min'][1] = lab_value[0]['min'][1]
    lab_data[__target_color[0]]['min'][2] = lab_value[0]['min'][2]
    lab_data[__target_color[0]]['max'][0] = lab_value[0]['max'][0]
    lab_data[__target_color[0]]['max'][1] = lab_value[0]['max'][1]
    lab_data[__target_color[0]]['max'][2] = lab_value[0]['max'][2]
    
    return (True, (), 'SetLABValue')

def getLABValue():
    _lab_value = yaml_handle.get_yaml_data(yaml_handle.lab_file_path)
    return (True, (_lab_value, ))

def saveLABValue(color):

    yaml_handle.save_yaml_data(lab_data, yaml_handle.lab_file_path)
    
    return (True, (), 'SaveLABValue')

# Find the contour with the largest area.
# Input: list of contours to compare.
def getAreaMaxContour(contours):
    contour_area_temp = 0
    contour_area_max = 0
    area_max_contour = None

    for c in contours:  # iterate over all contours
        contour_area_temp = math.fabs(cv2.contourArea(c))  # contour area
        if contour_area_temp > contour_area_max:
            contour_area_max = contour_area_temp
            # Only accept contours above a minimum size to filter out noise.
            if contour_area_temp > 10:
                area_max_contour = c

    return area_max_contour, contour_area_max  # (largest contour, area)

lab_data = None
def load_config():
    global lab_data
    
    lab_data = yaml_handle.get_yaml_data(yaml_handle.lab_file_path)

# Reset runtime state variables
def reset():
    global __target_color
       
    __target_color = ()

# Called once when the module is initialized
def init():
    print("lab_adjust Init")
    load_config()
    reset()

__isRunning = False
# Called when the mode starts
def start():
    global __isRunning
    __isRunning = True
    print("lab_adjust Start")

# Called when the mode stops
def stop():
    global __isRunning
    __isRunning = False
    reset()
    print("lab_adjust Stop")


# Called when the mode exits (cleanup)
def exit():
    global __isRunning
    __isRunning = False
    print("lab_adjust Exit")

def run(img):  
    img_copy = img.copy()
    img_h, img_w = img.shape[:2]
    
    if not __isRunning or __target_color == ():
        return img
    
    frame_gb = cv2.GaussianBlur(img_copy, (3, 3), 3)   
    frame_lab = cv2.cvtColor(frame_gb, cv2.COLOR_BGR2LAB)  # Convert frame to LAB color space
    
    for i in lab_data:
        if i in __target_color:
            frame_mask = cv2.inRange(frame_lab,
                                         (lab_data[i]['min'][0],
                                          lab_data[i]['min'][1],
                                          lab_data[i]['min'][2]),
                                         (lab_data[i]['max'][0],
                                          lab_data[i]['max'][1],
                                          lab_data[i]['max'][2]))  # Mask using LAB min/max
            eroded = cv2.erode(frame_mask, cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3)))  # Erode (remove noise)
            dilated = cv2.dilate(eroded, cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))) # Dilate (restore shape)
            frame_bgr = cv2.cvtColor(dilated, cv2.COLOR_GRAY2BGR)
            img = frame_bgr
    return img

if __name__ == '__main__':      
    init()
    start()
    my_camera = Camera.Camera()
    my_camera.camera_open()

    while True:
        img = my_camera.frame
        if img is not None:
            frame = img.copy()
            Frame = run(frame)           
            cv2.imshow('Frame', Frame)
            key = cv2.waitKey(1)
            if key == 27:
                break
        else:
            time.sleep(0.01)
    my_camera.camera_close()
    cv2.destroyAllWindows()
