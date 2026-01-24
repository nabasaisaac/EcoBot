import os
import sys
sys.path.append('/home/pi/MasterPi/')
import time
import HiwonderSDK.Board
from smbus2 import SMBus, i2c_msg

# Hiwonder I2C sonar sensor library

if sys.version_info.major == 2:
    print('Please run this program with python3!')
    sys.exit(0)

class Sonar:
    __units = {"mm":0, "cm":1}
    __dist_reg = 0

    __RGB_MODE = 2
    __RGB1_R = 3
    __RGB1_G = 4
    __RGB1_B = 5
    __RGB2_R = 6
    __RGB2_G = 7
    __RGB2_B = 8

    __RGB1_R_BREATHING_CYCLE = 9
    __RGB1_G_BREATHING_CYCLE = 10
    __RGB1_B_BREATHING_CYCLE = 11
    __RGB2_R_BREATHING_CYCLE = 12
    __RGB2_G_BREATHING_CYCLE = 13
    __RGB2_B_BREATHING_CYCLE = 14
    def __init__(self):
        self.i2c_addr = 0x77
        self.i2c = 1
        self.Pixels = [0,0]
        self.RGBMode = 0

    def __getattr(self, attr):
        if attr in self.__units:
            return self.__units[attr]
        if attr == "Distance":
            return self.getDistance()
        else:
            raise AttributeError('Unknow attribute : %s'%attr)

    def setRGBMode(self, mode):
        try:
            with SMBus(self.i2c) as bus:
                bus.write_byte_data(self.i2c_addr, self.__RGB_MODE, mode)
        except BaseException as e:
            print(e)