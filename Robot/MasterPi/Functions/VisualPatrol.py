#!/usr/bin/python3
# coding=utf8
import sys
sys.path.append('/home/pi/MasterPi/')
import cv2
import time
import math
import signal
import Camera
import threading
import numpy as np
import yaml_handle
from ArmIK.Transform import *
from ArmIK.ArmMoveIK import *
import  SDK.Misc as Misc
import  SDK.Board as Board
from  SDK.PID import PID

AK = ArmIK()
pitch_pid = PID(P=0.28, I=0.16, D=0.18)

range_rgb = {
    'red': (0, 0, 255),
    'blue': (255, 0, 0),
    'green': (0, 255, 0),
    'black': (0, 0, 0),
    'white': (255, 255, 255),
}

# Line following (visual patrol)
if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)


# Set target color(s) for line detection
def setTargetColor(target_color):
    global __target_color

    print("COLOR", target_color)
    __target_color = target_color
    return (True, ())

lab_data = None

def load_config():
    global lab_data
    lab_data = yaml_handle.get_yaml_data(yaml_handle.lab_file_path)

# Initial arm pose
def initMove():
    
    Board.setPWMServoPulse(1, 1500, 800)
    AK.setPitchRangeMoving((0, 7, 11), -60, -90, 0, 1500)
    MotorStop()
    
line_centerx = -1
# Reset runtime state variables
def reset():
    global line_centerx
    global __target_color
    
    line_centerx = -1
    __target_color = ()
    
# Called once when the module is initialized
def init():
    print("VisualPatrol Init")
    load_config()
    initMove()

__isRunning = False
# Called when the mode starts
def start():
    global __isRunning
    reset()
    __isRunning = True
    print("VisualPatrol Start")

# Called when the mode stops
def stop():
    global __isRunning
    __isRunning = False
    MotorStop()
    print("VisualPatrol Stop")

# Called when the mode exits (cleanup)
def exit():
    global __isRunning
    __isRunning = False
    MotorStop()
    print("VisualPatrol Exit")

def setBuzzer(timer):
    Board.setBuzzer(0)
    Board.setBuzzer(1)
    time.sleep(timer)
    Board.setBuzzer(0)

def MotorStop():
    Board.setMotor(1, 0) 
    Board.setMotor(2, 0)
    Board.setMotor(3, 0)
    Board.setMotor(4, 0)
    
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
            if contour_area_temp >= 5:
                area_max_contour = c

    return area_max_contour, contour_area_max  # (largest contour, area)

img_centerx = 320
def move():
    global line_centerx

    i = 0
    while True:
        if __isRunning:
            if line_centerx != -1:
                
                num = (line_centerx - img_centerx)
                if abs(num) <= 5:  # Small error - keep stable
                    pitch_pid.SetPoint = num
                else:
                    pitch_pid.SetPoint = 0
                pitch_pid.update(num) 
                tmp = pitch_pid.output    # PID output
                tmp = 100 if tmp > 100 else tmp   
                tmp = -100 if tmp < -100 else tmp
                base_speed = Misc.map(tmp, -100, 100, -50, 50)  # Map PID output to motor speed
                Board.setMotor(1, int(50-base_speed)) # Set motor speed
                Board.setMotor(2, int(50+base_speed))
                Board.setMotor(3, int(50-base_speed))
                Board.setMotor(4, int(50+base_speed))
                
            else:
                MotorStop()
                time.sleep(0.01)
        else:
            time.sleep(0.01)
 
# Background worker thread
th = threading.Thread(target=move)
th.setDaemon(True)
th.start()

roi = [ # [ROI, weight]
        (240, 280,  0, 640, 0.1), 
        (340, 380,  0, 640, 0.3), 
        (430, 460,  0, 640, 0.6)
       ]

roi_h1 = roi[0][0]
roi_h2 = roi[1][0] - roi[0][0]
roi_h3 = roi[2][0] - roi[1][0]

roi_h_list = [roi_h1, roi_h2, roi_h3]

size = (640, 480)
def run(img):
    global line_centerx
    global __target_color
    
    img_copy = img.copy()
    img_h, img_w = img.shape[:2]
    
    if not __isRunning or __target_color == ():
        return img
     
    frame_resize = cv2.resize(img_copy, size, interpolation=cv2.INTER_NEAREST)
    frame_gb = cv2.GaussianBlur(frame_resize, (3, 3), 3)         
    centroid_x_sum = 0
    weight_sum = 0
    center_ = []
    n = 0

    # Split image into top/middle/bottom regions for faster and more stable line detection
    for r in roi:
        roi_h = roi_h_list[n]
        n += 1       
        blobs = frame_gb[r[0]:r[1], r[2]:r[3]]
        frame_lab = cv2.cvtColor(blobs, cv2.COLOR_BGR2LAB)  # Convert region to LAB color space
        area_max = 0
        areaMaxContour = 0
        for i in lab_data:
            if i in __target_color:
                detect_color = i
                frame_mask = cv2.inRange(frame_lab,
                                         (lab_data[i]['min'][0],
                                          lab_data[i]['min'][1],
                                          lab_data[i]['min'][2]),
                                         (lab_data[i]['max'][0],
                                          lab_data[i]['max'][1],
                                          lab_data[i]['max'][2]))  # Mask using LAB min/max
                eroded = cv2.erode(frame_mask, cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3)))  # Erode (remove noise)
                dilated = cv2.dilate(eroded, cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))) # Dilate (restore shape)

        cnts = cv2.findContours(dilated , cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_L1)[-2]# Find contours
        cnt_large, area = getAreaMaxContour(cnts)# Largest contour
        if cnt_large is not None:# If a valid contour exists
            rect = cv2.minAreaRect(cnt_large)# Minimum-area bounding rectangle
            box = np.int0(cv2.boxPoints(rect))# Rectangle corner points
            for i in range(4):
                box[i, 1] = box[i, 1] + (n - 1)*roi_h + roi[0][0]
                box[i, 1] = int(Misc.map(box[i, 1], 0, size[1], 0, img_h))
            for i in range(4):                
                box[i, 0] = int(Misc.map(box[i, 0], 0, size[0], 0, img_w))

            cv2.drawContours(img, [box], -1, (0,0,255,255), 2)# Draw bounding rectangle
        
            # Get diagonal points of the rectangle
            pt1_x, pt1_y = box[0, 0], box[0, 1]
            pt3_x, pt3_y = box[2, 0], box[2, 1]            
            center_x, center_y = (pt1_x + pt3_x) / 2, (pt1_y + pt3_y) / 2# Center point
            cv2.circle(img, (int(center_x), int(center_y)), 5, (0,0,255), -1)# Draw center point
            center_.append([center_x, center_y])                        
            # Weighted sum across the three regions (top/middle/bottom)
            centroid_x_sum += center_x * r[4]
            weight_sum += r[4]
    if weight_sum is not 0:
        # Final computed center point
        cv2.circle(img, (line_centerx, int(center_y)), 10, (0,255,255), -1)# Draw center point
        line_centerx = int(centroid_x_sum / weight_sum)  
    else:
        line_centerx = -1
    return img

# Pre-exit handler
def Stop(signum, frame):
    global __isRunning
    
    __isRunning = False
    print('Shutting down...')
    MotorStop()  # Stop all motors

if __name__ == '__main__':
    
    init()
    start()
    signal.signal(signal.SIGINT, Stop)
    cap = cv2.VideoCapture('http://127.0.0.1:8080?action=stream')
    __target_color = ('red',)
    while __isRunning:
        ret,img = cap.read()
        if ret:
            frame = img.copy()
            Frame = run(frame)  
            frame_resize = cv2.resize(Frame, (320, 240))
            cv2.imshow('frame', frame_resize)
            key = cv2.waitKey(1)
            if key == 27:
                break
        else:
            time.sleep(0.01)
    cv2.destroyAllWindows()
