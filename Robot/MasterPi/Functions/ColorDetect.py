#!/usr/bin/python3
# coding=utf8
import sys
sys.path.append('/home/pi/MasterPi/')
import cv2
import time
import threading
import yaml_handle
from ArmIK.Transform import *
from ArmIK.ArmMoveIK import *
import  SDK.Board as Board

if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)

AK = ArmIK()

range_rgb = {
    'red': (0, 0, 255),
    'blue': (255, 0, 0),
    'green': (0, 255, 0),
    'black': (0, 0, 0),
    'white': (255, 255, 255),
}

lab_data = None
def load_config():
    global lab_data, servo_data
    
    lab_data = yaml_handle.get_yaml_data(yaml_handle.lab_file_path)

__target_color = ('red', 'green', 'blue')
def setTargetColor(target_color):
    global __target_color

    __target_color = target_color
    return (True, ())

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
            if contour_area_temp > 300:
                area_max_contour = c

    return area_max_contour, contour_area_max  # (largest contour, area)

# Gripper "close" servo pulse (tuned for this robot)
servo1 = 1500

# Initial arm pose
def initMove():
    Board.setPWMServoPulse(1, servo1, 300)
    AK.setPitchRangeMoving((0, 6, 18), 0,-90, 90, 1500)


# Buzzer helper
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
    global start_count_t1
    
    count = 0
    _stop = False
    color_list = []
    get_roi = False
    detect_color = 'None'
    start_pick_up = False
    start_count_t1 = True


    # Called once when the module is initialized
def init():
    print("ColorDetect Init")
    load_config()
    initMove()

# Called when the mode starts
def start():
    global __isRunning
    reset()
    __isRunning = True
    print("ColorDetect Start")

# Called when the mode stops
def stop():
    global _stop
    global __isRunning
    _stop = True
    __isRunning = False
    set_rgb('None')
    print("ColorDetect Stop")

# Called when the mode exits (cleanup)
def exit():
    global _stop
    global __isRunning
    _stop = True
    __isRunning = False
    set_rgb('None')
    print("ColorDetect Exit")


rect = None
size = (640, 480)
rotation_angle = 0
unreachable = False
world_X, world_Y = 0, 0
def move():
    global rect
    global _stop
    global get_roi
    global __isRunning
    global unreachable
    global detect_color
    global start_pick_up
    global rotation_angle
    global world_X, world_Y
    

    while True:
        if __isRunning:
            if detect_color != 'None' and start_pick_up:  # A color block was detected
                
                set_rgb(detect_color) # Match RGB LED to detected color
                setBuzzer(0.1)     # Beep for 0.1s
                
                if detect_color == 'red' :  # Red detected: nod
                    for i in range(0,3):
                        Board.setPWMServoPulse(3, 800, 200)
                        time.sleep(0.2)
                        Board.setPWMServoPulse(3, 600, 200)
                        time.sleep(0.2)
                        if not __isRunning:
                            continue

                    AK.setPitchRangeMoving((0, 6, 18), 0,-90, 90, 500)  # Return to initial pose
                    time.sleep(0.5)  
                    detect_color = 'None'
                    start_pick_up = False
                    set_rgb(detect_color)
                    
                else:                      # Green/Blue detected: shake head
                    for i in range(0,3):
                        Board.setPWMServoPulse(6, 1300, 400)
                        time.sleep(0.5)
                        Board.setPWMServoPulse(6, 1700, 400)
                        time.sleep(0.5)
                        if not __isRunning:
                            continue

                    AK.setPitchRangeMoving((0, 6, 18), 0,-90, 90, 500)  # Return to initial pose
                    time.sleep(0.5)
                    detect_color = 'None'
                    start_pick_up = False
                    set_rgb(detect_color)
            else:
                time.sleep(0.01)
        else:
            if _stop:
                print('ok')
                _stop = False
                initMove()  # Return to initial pose
                time.sleep(1.5)               
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

def run(img):
    global roi
    global rect
    global count
    global get_roi
    global center_list
    global unreachable
    global __isRunning
    global start_pick_up
    global last_x, last_y
    global rotation_angle
    global world_X, world_Y
    global start_count_t1, t1
    global detect_color, draw_color, color_list





        
    if not __isRunning:  # If not running, return the original image
        return img
    else:
        img_copy = img.copy()
        img_h, img_w = img.shape[:2]
        
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
                    opened = cv2.morphologyEx(frame_mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))  # Morph open
                    closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))  # Morph close
                    contours = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[-2]  # Find contours
                    areaMaxContour, area_max = getAreaMaxContour(contours)  # Largest contour
                    if areaMaxContour is not None:
                        if area_max > max_area:  # Track max area across colors
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
                            detect_color = 'None'
                            draw_color = range_rgb["black"]
            else:
                if not start_pick_up:
                    draw_color = (0, 0, 0)
                    detect_color = "None"   
        
        cv2.putText(img, "Color: " + detect_color, (10, img.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.65, draw_color, 2) # Overlay detected color
        
        return img

if __name__ == '__main__':
    init()
    start()
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

