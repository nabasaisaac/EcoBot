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

def move():
    global rect
    global _stop
    global get_roi
    global unreachable
    global __isRunning
    global detect_color
    global start_pick_up
    global rotation_angle
    global world_X, world_Y
    
    # Drop-off coordinates for each detected color (demo mode)
    coordinate = {
        'red':   (-15, 14, 2),
        'green': (-18, 9,  3),
        'blue':  (-18, 0, 2),
        'capture': (0, 16.5, 2)
    }
    
    while True:
        if __isRunning:        
            if detect_color != 'None' and start_pick_up:  # If a block is detected, start pickup
                
                set_rgb(detect_color) # Match RGB LED to detected color
                setBuzzer(0.1)     # Beep for 0.1s
                
                AK.setPitchRangeMoving((0, 6, 18), 0,-90, 90, 1500) # Lift the arm
                time.sleep(1.5)
                if not __isRunning:  # Stop if the mode is no longer running
                    continue
                Board.setPWMServoPulse(1, 2000, 500) # Open gripper
                time.sleep(1.5)
                if not __isRunning:
                    continue
                Board.setPWMServoPulse(1, 1500, 500) # Close gripper
                time.sleep(1.5)
                if not __isRunning:
                    continue
                if detect_color == 'red':       # Rotate base depending on detected color
                    Board.setPWMServoPulse(6, 1900, 500)
                    time.sleep(0.5)
                elif detect_color == 'green':
                    Board.setPWMServoPulse(6, 2100, 800)
                    time.sleep(0.8)
                elif detect_color == 'blue':
                    Board.setPWMServoPulse(6, 2500, 1500)
                    time.sleep(1.5)
                if not __isRunning:
                    continue
                result = AK.setPitchRangeMoving((coordinate[detect_color][0], coordinate[detect_color][1], 8), -90, -90, 0) # Move above drop-off point
                if result == False:
                    unreachable = True
                else:
                    unreachable = False
                    time.sleep(result[2]/1000) # Sleep for motion duration
                if not __isRunning:
                    continue
                AK.setPitchRangeMoving((coordinate[detect_color]), -90, -90, 0, 500)  # Move to final drop-off
                time.sleep(0.5)
                if not __isRunning:
                    continue
                Board.setPWMServoPulse(1, 1800, 500) # Open gripper (release)
                time.sleep(0.5)
                if not __isRunning:
                    continue
                AK.setPitchRangeMoving((coordinate[detect_color][0], coordinate[detect_color][1], 8), -90, -90, 0, 800) # Lift back up
                time.sleep(0.8)
                if not __isRunning:
                    continue
                Board.setPWMServosPulse([1200, 4, 1,1500, 3,515, 4,2170, 5,945]) # Reset arm pose
                time.sleep(1.2)
                if detect_color == 'red':
                    Board.setPWMServoPulse(6, 1500, 500)
                    time.sleep(0.5)
                elif detect_color == 'green':
                    Board.setPWMServoPulse(6, 1500, 800)
                    time.sleep(0.8)
                elif detect_color == 'blue':
                    Board.setPWMServoPulse(6, 1500, 1500)
                    time.sleep(1.5)
                AK.setPitchRangeMoving((0, 8, 10), -90, -90, 0, 1000)
                time.sleep(1)
                
                detect_color = 'None'
                get_roi = False
                start_pick_up = False
                set_rgb(detect_color)
            else:
                time.sleep(0.01)                
        else:
            if _stop:
                _stop = False
                initMove()
            time.sleep(0.01)
          
# Background worker thread
th = threading.Thread(target=move)
th.setDaemon(True)
th.start()    

t1 = 0
roi = ()
center_list = []
last_x, last_y = 0, 0
draw_color = range_rgb["black"]
length = 50
w_start = 200
h_start = 200
def run(img):
    global roi
    global rect
    global count
    global get_roi
    global center_list
    global unreachable
    global __isRunning
    global start_pick_up
    global rotation_angle
    global last_x, last_y
    global world_X, world_Y
    global start_count_t1, t1
    global detect_color, draw_color, color_list
    
    img_copy = img.copy()
    img_h, img_w = img.shape[:2]   

    if not __isRunning: # If not running, return the original image
        return img
    
    frame_resize = cv2.resize(img_copy, size, interpolation=cv2.INTER_NEAREST)
    frame_gb = cv2.GaussianBlur(frame_resize, (3, 3), 3)     
    frame_lab = cv2.cvtColor(frame_gb, cv2.COLOR_BGR2LAB)  # Convert frame to LAB color space

    color_area_max = None
    max_area = 0
    areaMaxContour_max = 0
    
    if not start_pick_up:
        for i in lab_data:
            if i in __target_color:
                frame_mask = cv2.inRange(frame_lab,
                                             (lab_data[i]['min'][0],
                                              lab_data[i]['min'][1],
                                              lab_data[i]['min'][2]),
                                             (lab_data[i]['max'][0],
                                              lab_data[i]['max'][1],
                                              lab_data[i]['max'][2]))  # Mask using LAB min/max
                opened = cv2.morphologyEx(frame_mask, cv2.MORPH_OPEN, np.ones((3, 3),np.uint8))  # Morph open
                closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, np.ones((3, 3),np.uint8)) # Morph close
                closed[:, 0:100] = 0
                contours = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[-2]  # Find contours
                areaMaxContour, area_max = getAreaMaxContour(contours)  # Largest contour
                if areaMaxContour is not None:
                    if area_max > max_area: # Track max area across colors
                        max_area = area_max
                        color_area_max = i
                        areaMaxContour_max = areaMaxContour
        if max_area > 2500:  # A sufficiently large object was found
            rect = cv2.minAreaRect(areaMaxContour_max)
            box = np.int0(cv2.boxPoints(rect))
            cv2.drawContours(img, [box], -1, range_rgb[color_area_max], 2)
            
            if not start_pick_up:
                if color_area_max == 'red':  # red is dominant
                    color = 1
                elif color_area_max == 'green':  # green is dominant
                    color = 2
                elif color_area_max == 'blue':  # blue is dominant
                    color = 3
                else:
                    color = 0
                color_list.append(color)

                if len(color_list) == 3:  # Multiple samples for stability
                    # Take average value
                    color = int(round(np.mean(np.array(color_list))))
                    color_list = []
                    if color:
                        start_pick_up = True
                        if color == 1:
                            detect_color = 'red'
                            draw_color = range_rgb["red"]
                        elif color == 2:
                            detect_color = 'green'
                            draw_color = range_rgb["green"]
                        elif color == 3:
                            detect_color = 'blue'
                            draw_color = range_rgb["blue"]
                    else:
                        start_pick_up = False
                        detect_color = 'None'
                        draw_color = range_rgb["black"]
        else:
            if not start_pick_up:
                draw_color = (0, 0, 0)
                detect_color = "None"

    cv2.putText(img, "Color: " + detect_color, (10, img.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.65, draw_color, 2)
    return img

if __name__ == '__main__':
    init()
    start()
    __target_color = ('red', 'green', 'blue')
    cap = cv2.VideoCapture('http://127.0.0.1:8080?action=stream')
    while True:
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