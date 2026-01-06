#!/usr/bin/python3
# coding=utf8
import os
import sys
sys.path.append('/home/pi/MasterPi/')
import time
import logging
import threading
from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
from jsonrpc import JSONRPCResponseManager, dispatcher
from ArmIK.ArmMoveIK import ArmIK
import SDK as hwsdk
import SDK.Misc as Misc
import SDK.Board as Board
import SDK.mecanum as mecanum
import Functions.Running as Running
import Functions.lab_adjust as lab_adjust
import Functions.ColorDetect as ColorDete
import Functions.ColorTracking as ColorTrack
import Functions.ColorSorting as ColorSort
import Functions.VisualPatrol as VisualPat
import Functions.Avoidance as Avoidan

if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)

__RPC_E01 = "E01 - Invalid number of parameter!"
__RPC_E02 = "E02 - Invalid parameter!"
__RPC_E03 = "E03 - Operation failed!"
__RPC_E04 = "E04 - Operation timeout!"
__RPC_E05 = "E05 - Not callable"

HWSONAR = None
QUEUE = None

ColorDete.initMove()
ColorDete.setBuzzer(0.3)

chassis = mecanum.MecanumChassis()
AK = ArmIK()

@dispatcher.add_method
def map(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

data = []
@dispatcher.add_method
def SetPWMServo(*args, **kwargs):
    ret = (True, (), 'SetPWMServo')
    print("SetPWMServo:",args)
    arglen = len(args)
    
    try:
        servos = args[2:arglen:2]
        pulses = args[3:arglen:2]
        use_times = args[0]
        servos_num =  args[1]
        data.insert(0, use_times)
        data.insert(1, servos_num)
        
        dat = zip(servos, pulses)
        for (s, p) in dat:
            pulses = int(map(p,90,-90,500,2500))
            data.append(s)
            data.append(pulses)
            
        Board.setPWMServosPulse(data)
        data.clear()
        
    except Exception as e:
        print('error3:', e)
        ret = (False, __RPC_E03, 'SetPWMServo')
    return ret

@dispatcher.add_method
def SetMovementAngle(angle):
    print(angle)
    try:
        if angle == -1:
            chassis.set_velocity(0,0,0)
            
        else:
            chassis.set_velocity(70,angle,0)
       
    except:
        ret = (False, __RPC_E03, 'SetMovementAngle')
        return ret

# Motor control (mecanum brush motors)
@dispatcher.add_method
def SetBrushMotor(*args, **kwargs):
    ret = (True, (), 'SetBrushMotor')
    arglen = len(args)
    print(args)
    if 0 != (arglen % 2):
        return (False, __RPC_E01, 'SetBrushMotor')
    try:
        motors = args[0:arglen:2]
        speeds = args[1:arglen:2]
        
        for m in motors:
            if m < 1 or m > 4:
                return (False, __RPC_E02, 'SetBrushMotor')
            
        dat = zip(motors, speeds)
        for m, s in dat:
            Board.setMotor(m, s)
            
    except:
        ret = (False, __RPC_E03, 'SetBrushMotor')
    return ret

# Read sonar distance
@dispatcher.add_method
def GetSonarDistance():
    global HWSONAR
    ret = (True, 0, 'GetSonarDistance')
    try:
        ret = (True, HWSONAR.getDistance(), 'GetSonarDistance')
    except:
        ret = (False, __RPC_E03, 'GetSonarDistance')
    return ret

# Read current battery voltage
@dispatcher.add_method
def GetBatteryVoltage():
    ret = (True, 0, 'GetBatteryVoltage')
    try:
        ret = (True, Board.getBattery(), 'GetBatteryVoltage')
    except Exception as e:
        print(e)
        ret = (False, __RPC_E03, 'GetBatteryVoltage')
    return ret

# Set sonar RGB LED mode
@dispatcher.add_method
def SetSonarRGBMode(mode = 0):
    global HWSONAR
    
    HWSONAR.setRGBMode(mode)
    return (True, (mode,), 'SetSonarRGBMode')

# Set sonar RGB LED color
@dispatcher.add_method
def SetSonarRGB(index, r, g, b):
    global HWSONAR
    print((r,g,b))
    if index == 0:
        HWSONAR.setPixelColor(0, Board.PixelColor(r, g, b))
        HWSONAR.setPixelColor(1, Board.PixelColor(r, g, b))
    else:
        HWSONAR.setPixelColor(index, (r, g, b))
    return (True, (r, g, b), 'SetSonarRGB')

# Configure sonar RGB breathing color and cycle time
@dispatcher.add_method
def SetSonarRGBBreathCycle(index, color, cycle):
    global HWSONAR
    
    HWSONAR.setBreathCycle(index, color, cycle)
    return (True, (index, color, cycle), 'SetSonarRGBBreathCycle')

# Start sonar RGB breathing / symphony effect
@dispatcher.add_method
def SetSonarRGBStartSymphony():
    global HWSONAR
    
    HWSONAR.startSymphony()    
    return (True, (), 'SetSonarRGBStartSymphony')

# Set obstacle-avoidance driving speed
@dispatcher.add_method
def SetAvoidanceSpeed(speed=50):
    print(speed)
    return runbymainth(Avoidan.setSpeed, (speed,))

# Set sonar distance threshold for obstacle avoidance (cm)
@dispatcher.add_method
def SetSonarDistanceThreshold(new_threshold=30):
    print(new_threshold)
    return runbymainth(Avoidan.setThreshold, (new_threshold,))

# Get current sonar distance threshold (cm)
@dispatcher.add_method
def GetSonarDistanceThreshold():
    return runbymainth(Avoidan.getThreshold, ())

def runbymainth(req, pas):
    if callable(req):
        event = threading.Event()
        ret = [event, pas, None]
        QUEUE.put((req, ret))
        count = 0
        while ret[2] is None:
            time.sleep(0.01)
            count += 1
            if count > 200:
                break
        if ret[2] is not None:
            if ret[2][0]:
                return ret[2]
            else:
                return (False, __RPC_E03 + " " + ret[2][1])
        else:
            return (False, __RPC_E04)
    else:
        return (False, __RPC_E05)

@dispatcher.add_method
def SetBusServoPulse(*args, **kwargs):
    ret = (True, (), 'SetBusServoPulse')
    arglen = len(args)
    if (args[1] * 2 + 2) != arglen or arglen < 4:
        return (False, __RPC_E01, 'SetBusServoPulse')
    try:
        servos = args[2:arglen:2]
        pulses = args[3:arglen:2]
        use_times = args[0]
        for s in servos:
           if s < 1 or s > 6:
                return (False, __RPC_E02)
        dat = zip(servos, pulses)
        for (s, p) in dat:
            Board.setBusServoPulse(s, p, use_times)
    except Exception as e:
        print(e)
        ret = (False, __RPC_E03, 'SetBusServoPulse')
    return ret
