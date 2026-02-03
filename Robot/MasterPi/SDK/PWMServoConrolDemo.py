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
******* Function: PWM servo control demo (EcoBot) ********
**********************************************************
----------------------------------------------------------


----------------------------------------------------------
Tips:
 * Press Ctrl+C to stop the program (try multiple times if needed).
----------------------------------------------------------
''')

start = True
# Pre-exit handler
def Stop(signum, frame):
    global start

    start = False
    print('Shutting down...')

signal.signal(signal.SIGINT, Stop)

if __name__ == '__main__':
    
    while True:
        Board.setPWMServoPulse(1, 1500, 1000) # Servo #1 pulse=1500, time=1000ms
        time.sleep(1)
        Board.setPWMServoPulse(1, 2500, 1000) # Servo #1 pulse=2500, time=1000ms
        time.sleep(1)
        
        if not start:
            Board.setPWMServoPulse(1, 1500, 1000) # Servo #1 back to 1500
            time.sleep(1)
            print('Stopped')
            break
    
    
        