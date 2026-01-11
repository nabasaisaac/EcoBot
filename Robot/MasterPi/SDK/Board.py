#!/usr/bin/env python3
# encoding: utf-8
import os
import sys
import time
import threading
import sqlite3 as sql
sys.path.append('/home/pi/MasterPi/')
import yaml_handle
import HiwonderSDK.Board as Board

runningAction = False
stopRunning = False

def stop_action_group():
    global stopRunning
    
    stopRunning = True

def runAction(actNum):
    '''
    Run an action group file (sequence of servo poses).
    Note: this function does not support an external "stop" signal mid-run.

    :param actNum: Action group name (string, without extension)
    '''
    global runningAction
    global stopRunning
    global online_action_times
    if actNum is None:
        return
    actNum = "/home/pi/MasterPi/ActionGroups/" + actNum + ".d6a"
    stopRunning = False
    if os.path.exists(actNum) is True:
        if runningAction is False:
            runningAction = True
            ag = sql.connect(actNum)
            cu = ag.cursor()
            cu.execute("select * from ActionGroup")
            deviation_data = yaml_handle.get_yaml_data(yaml_handle.Deviation_file_path)
            while True:
                act = cu.fetchone()
                if stopRunning is True:
                    stopRunning = False                   
                    break
                if act is not None:
                    Board.setPWMServosPulse([ act[1], 5, 1,act[2] + deviation_data['1'],
                                                         3,act[3] + deviation_data['3'],
                                                         4,act[4] + deviation_data['4'],
                                                         5,act[5] + deviation_data['5'],
                                                         6,act[6] + deviation_data['6']])
                    if stopRunning is True:
                        stopRunning = False                   
                        break
                    time.sleep(float(act[1])/1000.0)
                else:   # Exit after completing the action group
                    break
            runningAction = False
            
            cu.close()
            ag.close()
    else:
        runningAction = False
        print("Action group file not found")
 Hiwonder Raspberry Pi expansion board SDK
if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)

__ADC_BAT_ADDR = 0
__SERVO_ADDR   = 21
__MOTOR_ADDR   = 31
__SERVO_ADDR_CMD  = 40

__motor_speed = [0, 0, 0, 0]
__servo_angle = [0, 0, 0, 0, 0, 0]
__servo_pulse = [0, 0, 0, 0, 0, 0]
__i2c = 1
__i2c_addr = 0x7A

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

__RGB_COUNT = 2
__RGB_PIN = 12
__RGB_FREQ_HZ = 800000
__RGB_DMA = 10
__RGB_BRIGHTNESS = 120
__RGB_CHANNEL = 0
__RGB_INVERT = False
RGB = PixelStrip(__RGB_COUNT, __RGB_PIN, __RGB_FREQ_HZ, __RGB_DMA, __RGB_INVERT, __RGB_BRIGHTNESS, __RGB_CHANNEL)
RGB.begin()
for i in range(RGB.numPixels()):
    RGB.setPixelColor(i, PixelColor(0,0,0))
    RGB.show()
