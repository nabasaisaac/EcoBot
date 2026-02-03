#!/usr/bin/python3
# coding=utf8
import sys
sys.path.append('/home/pi/MasterPi/')
import cv2
import time
import Camera
import threading
import yaml_handle
from ArmIK.Transform import *
from ArmIK.ArmMoveIK import *
import  SDK.Sonar as Sonar
import  SDK.Board as Board
from CameraCalibration.CalibrationConfig import *

if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)

AK = ArmIK()
HWSONAR = Sonar.Sonar()  # Sonar sensor

range_rgb = {
    'red':   (0, 0, 255),
    'blue':  (255, 0, 0),
    'green': (0, 255, 0),
    'black': (0, 0, 0),
    'white': (255, 255, 255),
}

lab_data = None
def load_config():
    global lab_data, servo_data
    
    lab_data = yaml_handle.get_yaml_data(yaml_handle.lab_file_path)

__target_color = ('red')
# Set target color(s) for sorting
def setTargetColor(target_color):
    global __target_color

    print("COLOR", target_color)
    __target_color = target_color
    return (True, ())

# Find the contour with the largest area.
# Input: list of contours to compare.
def getAreaMaxContour(contours) :
        contour_area_temp = 0
        contour_area_max = 0
        area_max_contour = None

        for c in contours : # iterate over all contours
            contour_area_temp = math.fabs(cv2.contourArea(c))  # contour area
            if contour_area_temp > contour_area_max:
                contour_area_max = contour_area_temp
                # Only accept contours above a minimum size to filter out noise.
                if contour_area_temp > 300:
                    area_max_contour = c

        return area_max_contour, contour_area_max  # (largest contour, area)

# Gripper "close" servo pulse (tuned for this robot)
servo1 = 1500

# Initial arm pose
def initMove():
    Board.setPWMServoPulse(1, servo1, 800)
    AK.setPitchRangeMoving((0, 8, 10), -90, -90, 0, 1500)

def setBuzzer(timer):
    Board.setBuzzer(0)
    Board.setBuzzer(1)
    time.sleep(timer)
    Board.setBuzzer(0)
    

# Set the controller RGB LED to match the target color.
def set_rgb(color):
    if color == "red":
        Board.RGB.setPixelColor(0, Board.PixelColor(255, 0, 0))
        Board.RGB.setPixelColor(1, Board.PixelColor(255, 0, 0))
        Board.RGB.show()
    elif color == "green":
        Board.RGB.setPixelColor(0, Board.PixelColor(0, 255, 0))
        Board.RGB.setPixelColor(1, Board.PixelColor(0, 255, 0))
        Board.RGB.show()
    elif color == "blue":
        Board.RGB.setPixelColor(0, Board.PixelColor(0, 0, 255))
        Board.RGB.setPixelColor(1, Board.PixelColor(0, 0, 255))
        Board.RGB.show()
    else:
        Board.RGB.setPixelColor(0, Board.PixelColor(0, 0, 0))
        Board.RGB.setPixelColor(1, Board.PixelColor(0, 0, 0))
        Board.RGB.show()

count = 0
_stop = False
color_list = []
get_roi = False
__isRunning = False
detect_color = 'None'
start_pick_up = False
start_count_t1 = True



# Reset runtime state variables
def reset():
    global _stop
    global count
    global get_roi
    global color_list
    global detect_color
    global start_pick_up
    global __target_color
    global start_count_t1

    count = 0
    _stop = False
    color_list = []
    get_roi = False
    __target_color = ()
    detect_color = 'None'
    start_pick_up = False
    start_count_t1 = True

# Called once when the module is initialized
def init():
    print("ColorSorting Init")
    # Turn off sonar LEDs by default
    HWSONAR.setRGBMode(0)
    HWSONAR.setPixelColor(0, Board.PixelColor(0,0,0))
    HWSONAR.setPixelColor(1, Board.PixelColor(0,0,0))    
    HWSONAR.show()
    load_config()
    initMove()

# Called when the mode starts
def start():
    global __isRunning
    reset()
    __isRunning = True
    print("ColorSorting Start")

# Called when the mode stops
def stop():
    global _stop
    global __isRunning
    _stop = True
    __isRunning = False
    set_rgb('None')
    print("ColorSorting Stop")

# Called when the mode exits (cleanup)
def exit():
    global _stop
    global __isRunning
    _stop = True
    set_rgb('None')
    __isRunning = False
    print("ColorSorting Exit")


rect = None
size = (640, 480)
rotation_angle = 0
unreachable = False 
world_X, world_Y = 0, 0