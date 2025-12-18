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

def setLinkLength(self, L1=l1, L2=l2, L3=l3, L4=l4, L5=l5, L6=l6):
        # Update link lengths to support different arm builds.
        self.l1 = L1
        self.l2 = L2
        self.l3 = L3
        self.l4 = L4
        self.l5 = L5
        self.l6 = L6
        if self.arm_type == 'pump':
            self.l4 = sqrt(pow(self.l5, 2) + pow(self.l6, 2))
            self.alpha = degrees(atan(self.l6 / self.l5))

    def getLinkLength(self):
        # Return current link length configuration.
        if self.arm_type == 'pump':
            return {"L1":self.l1, "L2":self.l2, "L3":self.l3, "L4":self.l4, "L5":self.l5, "L6":self.l6}
        else:
            return {"L1":self.l1, "L2":self.l2, "L3":self.l3, "L4":self.l4}



def getRotationAngle(self, coordinate_data, Alpha):
        # Given target end-effector position and pitch angle, compute joint angles.
        # Returns False if no valid solution.
        # coordinate_data: end-effector (x, y, z) in cm, e.g. (0, 5, 10)
        # Alpha: pitch angle relative to horizontal, in degrees

        # Geometry notes:
        # - End-effector tip is P(X, Y, Z)
        # - O is the origin (projection of the gimbal center onto the ground plane)
        # - P_ is the ground projection of P
        # - Link joints: A (l1-l2), B (l2-l3), C (l3-l4)
        # - Angle notation: e.g., angle between AB and BC is written as ∠ABC
        X, Y, Z = coordinate_data
        if self.arm_type == 'pump':
            Alpha -= self.alpha
        # Base rotation angle
        theta6 = degrees(atan2(Y, X))
 
        P_O = sqrt(X*X + Y*Y) # distance from ground projection to origin
        CD = self.l4 * cos(radians(Alpha))
        PD = self.l4 * sin(radians(Alpha)) # PD sign follows Alpha sign
        AF = P_O - CD
        CF = Z - self.l1 - PD
        AC = sqrt(pow(AF, 2) + pow(CF, 2))
        if round(CF, 4) < -self.l1:
            logger.debug('Height below zero, CF(%s) < -l1(%s)', CF, -self.l1)
            return False
        if self.l2 + self.l3 < round(AC, 4): # triangle inequality fails
            logger.debug('Invalid linkage geometry, l2(%s) + l3(%s) < AC(%s)', self.l2, self.l3, AC)
            return False

        # Solve theta4
        cos_ABC = round((pow(self.l2, 2) + pow(self.l3, 2) - pow(AC, 2))/(2*self.l2*self.l3), 4) # cosine law
        if abs(cos_ABC) > 1:
            logger.debug('Invalid linkage geometry, abs(cos_ABC(%s)) > 1', cos_ABC)
            return False
        ABC = acos(cos_ABC) # radians
        theta4 = 180.0 - degrees(ABC)

        # Solve theta5
        CAF = acos(AF / AC)
        cos_BAC = round((pow(AC, 2) + pow(self.l2, 2) - pow(self.l3, 2))/(2*self.l2*AC), 4) # cosine law
        if abs(cos_BAC) > 1:
            logger.debug('Invalid linkage geometry, abs(cos_BAC(%s)) > 1', cos_BAC)
            return False
        if CF < 0:
            zf_flag = -1
        else:
            zf_flag = 1
        theta5 = degrees(CAF * zf_flag + acos(cos_BAC))

        # Solve theta3
        theta3 = Alpha - theta5 + theta4
        if self.arm_type == 'pump':
            theta3 += self.alpha

        return {"theta3":theta3, "theta4":theta4, "theta5":theta5, "theta6":theta6} # solution angles
            
if __name__ == '__main__':
    ik = IK('arm')
    # ik.setLinkLength(L1=ik.l1 + 1.30, L4=ik.l4)
    print('Link lengths:', ik.getLinkLength())
    #print(ik.getRotationAngle((0, ik.l4, ik.l1 + ik.l2 + ik.l3), 0))
