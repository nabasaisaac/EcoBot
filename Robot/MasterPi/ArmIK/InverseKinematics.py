#!/usr/bin/env python3
# encoding: utf-8
# 4-DOF robot arm inverse kinematics: given (X, Y, Z) and a pitch angle,
# compute the required joint rotation angles.
# 2020/07/20 Aiden
import logging
from math import *

# CRITICAL, ERROR, WARNING, INFO, DEBUG
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

class IK:
    # Servos are numbered from the base upwards.
    # Shared parameters: link lengths for the 4-DOF arm (cm).
    l1 = 8.00    # base center to servo-2 axis
    l2 = 6.50    # servo-2 to servo-3
    l3 = 6.20    # servo-3 to servo-4
    l4 = 0.00    # end-effector link length (set based on arm_type)

    # Parameters for the vacuum pump end-effector variant
    l5 = 4.70  # servo-4 to point above nozzle (cm)
    l6 = 4.46  # point above nozzle to nozzle tip (cm)
    alpha = degrees(atan(l6 / l5))  # angle between l5 and l4

    def __init__(self, arm_type): # Adapt parameters based on end-effector type
        self.arm_type = arm_type
        if self.arm_type == 'pump': # vacuum pump arm
            self.l4 = sqrt(pow(self.l5, 2) + pow(self.l6, 2))  # servo-4 to nozzle treated as link-4
        elif self.arm_type == 'arm':
            self.l4 = 10.00  # servo-4 to gripper tip (cm, when gripper fully closed)

