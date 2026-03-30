#!/usr/bin/python3
# coding=utf8
import sys
sys.path.append('/home/pi/MasterPi/')
import time
import signal
import SDK.mecanum as mecanum

if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)
    
print('''
**********************************************************
**************** Function: drifting move demo *************
**********************************************************
----------------------------------------------------------
------------
Tips:
 * Press Ctrl+C to stop the program (try multiple times if needed).
----------------------------------------------------------
''')

chassis = mecanum.MecanumChassis()

start = True
# Pre-exit handler
def Stop(signum, frame):
    global start

    start = False
    print('Shutting down...')
    chassis.set_velocity(0,0,0)  # Stop all motors
    

signal.signal(signal.SIGINT, Stop)

if __name__ == '__main__':
    while start:
        chassis.set_velocity(50,180,0.3)
        time.sleep(3)
        chassis.set_velocity(50,0,-0.3)
        time.sleep(3)
    chassis.set_velocity(0,0,0)  # Stop all motors
    print('Stopped')

        
