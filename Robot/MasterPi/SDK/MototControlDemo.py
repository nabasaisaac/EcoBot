#!/usr/bin/python3
# coding=utf8
import sys
sys.path.append('/home/pi/MasterPi/')
import time
import signal
import threading
import HiwonderSDK.Board as Board

if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)
    
print('''
**********************************************************
********* Function: expansion board motor demo *********
**********************************************************
----------------------------------------------------------


----------------------------------------------------------
Tips:
 * Press Ctrl+C to stop the program (try multiple times if needed).
----------------------------------------------------------
''')

# Stop all motors
def MotorStop():
    Board.setMotor(1, 0) 
    Board.setMotor(2, 0)
    Board.setMotor(3, 0)
    Board.setMotor(4, 0)

start = True
# Pre-exit handler
def Stop(signum, frame):
    global start

    start = False
    print('Shutting down...')
    MotorStop()  # Stop all motors
    

signal.signal(signal.SIGINT, Stop)

if __name__ == '__main__':
    
    while True:
        Board.setMotor(1, 35)  # Set motor #1 speed to 35
        time.sleep(1)
        Board.setMotor(1, 60)  # Set motor #1 speed to 60
        time.sleep(2)
        Board.setMotor(1, 90)  # Set motor #1 speed to 90
        time.sleep(3)    
        
        if not start:
            MotorStop()  # Stop all motors
            print('Stopped')
            break
    
    
        