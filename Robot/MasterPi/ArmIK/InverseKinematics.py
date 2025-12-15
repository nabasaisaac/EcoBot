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
