#!/usr/bin/env python3
# encoding: utf-8
import os
import re
import cv2
import sys
import math
import time
import json
import yaml
import sqlite3
import addcolor
import requests
import threading
import resource_rc
from socket import *
import SetPWMServo as PWM
from ServoCmd import *
from ArmUi import Ui_Form
from PyQt5.QtGui import *
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5 import QtGui, QtWidgets
from PyQt5.QtSql import QSqlDatabase, QSqlQuery


class MainWindow(QtWidgets.QWidget, Ui_Form):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.setupUi(self)                               
        self.setWindowIcon(QIcon(':/images/Arm.png'))
        self.tabWidget.setCurrentIndex(0)  # Default to the first tab
        self.tableWidget.setSelectionBehavior(QAbstractItemView.SelectRows)  # Select whole rows (instead of individual cells)
        self.message = QMessageBox()
        self.resetServos_ = False
        self.path = '/home/pi/MasterPi/'
        self.actdir = self.path + "ActionGroups/"
        self.button_controlaction_clicked('reflash')
        ######################## Main UI ###############################
        self.t1  = 0
        self.Deviation_file = 'Deviation.yaml'
        self.lab_file = 'lab_config.yaml'
        
        self.validator1 = QIntValidator(500, 2500)
        self.lineEdit_1.setValidator(self.validator1)
        self.lineEdit_3.setValidator(self.validator1)
        self.lineEdit_4.setValidator(self.validator1)
        self.lineEdit_5.setValidator(self.validator1)
        self.lineEdit_6.setValidator(self.validator1)

        # Keep sliders and text inputs in sync; also drive servos on value change
        self.horizontalSlider_1.valueChanged.connect(lambda: self.valuechange1('id1'))
        self.horizontalSlider_3.valueChanged.connect(lambda: self.valuechange1('id3'))
        self.horizontalSlider_4.valueChanged.connect(lambda: self.valuechange1('id4'))
        self.horizontalSlider_5.valueChanged.connect(lambda: self.valuechange1('id5'))
        self.horizontalSlider_6.valueChanged.connect(lambda: self.valuechange1('id6'))
        
        self.horizontalSlider_11.valueChanged.connect(lambda: self.valuechange2('d1'))
        self.horizontalSlider_13.valueChanged.connect(lambda: self.valuechange2('d3'))
        self.horizontalSlider_14.valueChanged.connect(lambda: self.valuechange2('d4'))
        self.horizontalSlider_15.valueChanged.connect(lambda: self.valuechange2('d5'))
        self.horizontalSlider_16.valueChanged.connect(lambda: self.valuechange2('d6'))
        
        self.radioButton_zn.toggled.connect(lambda: self.language(self.radioButton_zn))
        self.radioButton_en.toggled.connect(lambda: self.language(self.radioButton_en))
        # Default UI language: English
        self.radioButton_en.setChecked(True)
        self.chinese = False
        
        # When a table row is clicked, update the "current row" marker icon
        self.tableWidget.pressed.connect(self.icon_position)

        self.validator3 = QIntValidator(20, 30000)
        self.lineEdit_time.setValidator(self.validator3)

        # Bind action-group editor buttons to handlers

        self.Button_AddAction.pressed.connect(lambda: self.button_editaction_clicked('addAction'))
        self.Button_DelectAction.pressed.connect(lambda: self.button_editaction_clicked('delectAction'))
        self.Button_DelectAllAction.pressed.connect(lambda: self.button_editaction_clicked('delectAllAction'))                                                 
        self.Button_UpdateAction.pressed.connect(lambda: self.button_editaction_clicked('updateAction'))
        self.Button_InsertAction.pressed.connect(lambda: self.button_editaction_clicked('insertAction'))
        self.Button_MoveUpAction.pressed.connect(lambda: self.button_editaction_clicked('moveUpAction'))
        self.Button_MoveDownAction.pressed.connect(lambda: self.button_editaction_clicked('moveDownAction'))        

        # Bind run/stop buttons for online execution
        self.Button_Run.clicked.connect(lambda: self.button_run('run'))
        self.Button_OpenActionGroup.pressed.connect(lambda: self.button_flie_operate('openActionGroup'))
        self.Button_SaveActionGroup.pressed.connect(lambda: self.button_flie_operate('saveActionGroup'))
        self.Button_ReadDeviation.pressed.connect(lambda: self.button_flie_operate('readDeviation'))
        self.Button_SaveDeviation.pressed.connect(lambda: self.button_flie_operate('saveDeviation'))
        self.Button_TandemActionGroup.pressed.connect(lambda: self.button_flie_operate('tandemActionGroup'))
        self.Button_ReSetServos.pressed.connect(lambda: self.button_re_clicked('reSetServos'))
        
        # Bind action control buttons (run/stop/delete/refresh, etc.)
        self.Button_DelectSingle.pressed.connect(lambda: self.button_controlaction_clicked('delectSingle'))
        self.Button_AllDelect.pressed.connect(lambda: self.button_controlaction_clicked('allDelect'))
        self.Button_RunAction.pressed.connect(lambda: self.button_controlaction_clicked('runAction'))
        self.Button_StopAction.pressed.connect(lambda: self.button_controlaction_clicked('stopAction'))
        self.Button_Reflash.pressed.connect(lambda: self.button_controlaction_clicked('reflash'))
        self.Button_Quit.pressed.connect(lambda: self.button_controlaction_clicked('quit'))
        
        self.devNew = [0, 0, 0, 0, 0]
        self.dev_change = False 
        self.readDevOk = False
        self.totalTime = 0
        self.row = 0
             
        ################################# Secondary UI #######################################
        
        self.color = 'red'
        self.L_Min = 0
        self.A_Min = 0
        self.B_Min = 0
        self.L_Max = 255
        self.A_Max = 255
        self.B_Max = 255
        self.servo1 = 90
        self.servo2 = 90
        self.kernel_open = 3
        self.kernel_close = 3
        self.camera_ui = False
        self.camera_ui_break = False
        
        self.horizontalSlider_LMin.valueChanged.connect(lambda: self.horizontalSlider_labvaluechange('lmin'))
        self.horizontalSlider_AMin.valueChanged.connect(lambda: self.horizontalSlider_labvaluechange('amin'))
        self.horizontalSlider_BMin.valueChanged.connect(lambda: self.horizontalSlider_labvaluechange('bmin'))
        self.horizontalSlider_LMax.valueChanged.connect(lambda: self.horizontalSlider_labvaluechange('lmax'))
        self.horizontalSlider_AMax.valueChanged.connect(lambda: self.horizontalSlider_labvaluechange('amax'))
        self.horizontalSlider_BMax.valueChanged.connect(lambda: self.horizontalSlider_labvaluechange('bmax'))

        self.pushButton_connect.pressed.connect(lambda: self.on_pushButton_action_clicked('connect'))
        self.pushButton_disconnect.pressed.connect(lambda: self.on_pushButton_action_clicked('disconnect'))
        self.pushButton_labWrite.pressed.connect(lambda: self.on_pushButton_action_clicked('labWrite'))
        self.pushButton_quit2_2.pressed.connect(lambda: self.button_clicked('quit2'))
        self.pushButton_addcolor.clicked.connect(self.addcolor)
        self.pushButton_deletecolor.clicked.connect(self.deletecolor)
        
        self._timer = QTimer()
        self._timer.timeout.connect(self.show_image)
        self.createConfig()


    def englishUi(self):
        _translate = QCoreApplication.translate
        self.label_16.setText(_translate("Form", "<html><head/><body><p align=\"justify\">left</p></body></html>"))
        self.label_18.setText(_translate("Form", "<html><head/><body><p align=\"justify\">right</p></body></html>"))
        self.label_action.setText(_translate("Form", "Action group："))
        self.Button_DelectSingle.setText(_translate("Form", "Erase"))
        self.Button_AllDelect.setText(_translate("Form", "Erase all"))
        self.Button_RunAction.setText(_translate("Form", "Run action group"))
        self.Button_StopAction.setText(_translate("Form", "Stop"))
        self.Button_Quit.setText(_translate("Form", "Exit"))
        self.Button_Reflash.setText(_translate("Form", "Refresh"))
        self.checkBox.setText(_translate("Form", "Loop"))
        self.Button_Run.setText(_translate("Form", "Run"))
        self.Button_ReadDeviation.setText(_translate("Form", "ReadDeviation"))
        self.Button_SaveDeviation.setText(_translate("Form", "SaveDeviation"))
        item = self.tableWidget.horizontalHeaderItem(1)
        item.setText(_translate("Form", "Index"))
        item = self.tableWidget.horizontalHeaderItem(2)
        item.setText(_translate("Form", "Time"))
        self.Button_OpenActionGroup.setText(_translate("Form", "Open action file"))
        self.Button_SaveActionGroup.setText(_translate("Form", "Save action file"))
        self.Button_TandemActionGroup.setText(_translate("Form", "Integrate files"))
        self.label_time.setText(_translate("Form", "Running time"))
        self.Button_AddAction.setText(_translate("Form", "Add action"))
        self.Button_DelectAction.setText(_translate("Form", "Delete action"))
        self.Button_UpdateAction.setText(_translate("Form", "Update action"))
        self.Button_InsertAction.setText(_translate("Form", "Insert action"))

        self.Button_MoveUpAction.setText(_translate("Form", "Move up"))
        self.Button_MoveDownAction.setText(_translate("Form", "Move down"))
        self.label_time_2.setText(_translate("Form", "Total time"))
        self.Button_DelectAllAction.setText(_translate("Form", "Delete all"))
        self.label_13.setText(_translate("Form", "<html><head/><body><p align=\"justify\">down</p></body></html>"))
        self.label_15.setText(_translate("Form", "<html><head/><body><p align=\"justify\">up</p></body></html>"))
        self.label_2.setText(_translate("Form", "<html><head/><body><p align=\"justify\">close</p></body></html>"))
        self.label_3.setText(_translate("Form", "<html><head/><body><p align=\"justify\">release</p></body></html>"))
        self.label_10.setText(_translate("Form", "<html><head/><body><p align=\"justify\">down</p></body></html>"))
        self.label_12.setText(_translate("Form", "<html><head/><body><p align=\"justify\">up</p></body></html>"))
        self.label_7.setText(_translate("Form", "<html><head/><body><p align=\"justify\">up</p></body></html>"))
        self.label_9.setText(_translate("Form", "<html><head/><body><p align=\"justify\">down</p></body></html>"))      
        
        self.Button_ReSetServos.setText(_translate("Form", "Reset servo"))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab_1), _translate("Form", "Normal Mode"))
        
        self.label_8.setText(_translate("Form", "400x300image"))
        self.pushButton_labWrite.setText(_translate("Form", "Save"))
        self.pushButton_addcolor.setText(_translate("Form", "Add"))
        self.pushButton_deletecolor.setText(_translate("Form", "Delete"))
        self.pushButton_connect.setText(_translate("Form", "Connect"))
        self.pushButton_disconnect.setText(_translate("Form", "Disconnect"))
        self.pushButton_quit2_2.setText(_translate("Form", "Exit"))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab), _translate("Form", "Camera Tool"))

    # Message dialog helper
    def message_from(self, string):
        try:
            QMessageBox.about(self, '', string)
            time.sleep(0.01)
        except:
            pass
    
    def message_From(self, string):
        self.message_from(string)


    # Message dialog helper
    def message_delect(self, string):
        messageBox = QMessageBox()
        messageBox.setWindowTitle(' ')
        messageBox.setText(string)
        messageBox.addButton(QPushButton('OK'), QMessageBox.YesRole)
        messageBox.addButton(QPushButton('Cancel'), QMessageBox.NoRole)
        return messageBox.exec_()

    # Window close handler
    def closeEvent(self, e):        
        result = QMessageBox.question(self,
                                    "Exit",
                                    "Do you want to quit?",
                                    QMessageBox.Yes | QMessageBox.No,
                                    QMessageBox.No)
        if result == QMessageBox.Yes:
            self.camera_ui = True
            self.camera_ui_break = True
            QWidget.closeEvent(self, e)
        else:
            e.ignore()
    
    def language(self, name):
        # Use the radio button identity rather than the displayed text.
        if name is self.radioButton_zn:
            self.chinese = True
            Ui_Form.retranslateUi(self, self)
        else:
            self.chinese = False
            self.englishUi()
            
    def keyPressEvent(self, event):
        if event.key() == 16777220:
            self.resetServos_ = True
            self.deviation_data = self.get_yaml_data(self.path + self.Deviation_file)
            servo1_pulse = int(self.lineEdit_1.text())
            servo3_pulse = int(self.lineEdit_3.text())
            servo4_pulse = int(self.lineEdit_4.text())
            servo5_pulse = int(self.lineEdit_5.text())
            servo6_pulse = int(self.lineEdit_6.text())
            self.horizontalSlider_1.setValue(servo1_pulse)
            self.horizontalSlider_3.setValue(servo3_pulse)
            self.horizontalSlider_4.setValue(servo4_pulse)
            self.horizontalSlider_5.setValue(servo5_pulse)
            self.horizontalSlider_6.setValue(servo6_pulse)
            data = [800, 5, 1,servo1_pulse + self.deviation_data[str(1)],
                            3,servo3_pulse + self.deviation_data[str(3)],
                            4,servo4_pulse + self.deviation_data[str(4)],
                            5,servo5_pulse + self.deviation_data[str(5)],
                            6,servo6_pulse + self.deviation_data[str(6)]]
            PWM.setPWMServosPulse(data)
            data.clear()
            self.resetServos_ = False
    
    def addcolor(self):
        self.qdi = QDialog()
        self.d = addcolor.Ui_Dialog()
        self.d.setupUi(self.qdi)
        self.qdi.show()
        self.d.pushButton_ok.clicked.connect(self.getcolor)
        self.d.pushButton_cancel.pressed.connect(self.closeqdialog)
    
    def deletecolor(self):
        result = self.message_delect('Delect?')
        if not result:
            self.color = self.comboBox_color.currentText()
            del self.current_lab_data[self.color]
            self.save_yaml_data(self.current_lab_data, self.path + self.lab_file)
            
            self.comboBox_color.clear()
            self.comboBox_color.addItems(self.current_lab_data.keys())

    def getcolor(self):
        color = self.d.lineEdit.text()
        self.comboBox_color.addItem(color)
        time.sleep(0.1)
        self.qdi.accept()
    
    def closeqdialog(self):
        self.qdi.accept()

    # Keep slider values in sync with the text inputs and drive servos
    def valuechange1(self, name):
        if not self.resetServos_:
            self.deviation_data = self.get_yaml_data(self.path + self.Deviation_file)
            if name == 'id1':
                servoAngle1 = self.horizontalSlider_1.value()
                self.lineEdit_1.setText(str(servoAngle1))
                PWM.setPWMServoPulse(1, servoAngle1 + self.deviation_data[str(1)], 20)
            if name == 'id3':
                print("ID3")
                servoAngle3 = self.horizontalSlider_3.value()
                self.lineEdit_3.setText(str(servoAngle3))
                PWM.setPWMServoPulse(3, servoAngle3 + self.deviation_data[str(3)], 20)
            if name == 'id4':
                servoAngle4 = self.horizontalSlider_4.value()
                self.lineEdit_4.setText(str(servoAngle4))
                PWM.setPWMServoPulse(4, servoAngle4 + self.deviation_data[str(4)], 20)
            if name == 'id5':
                servoAngle5 = self.horizontalSlider_5.value()
                self.lineEdit_5.setText(str(servoAngle5))
                PWM.setPWMServoPulse(5, servoAngle5 + self.deviation_data[str(5)], 20)
            if name == 'id6':
                servoAngle6 = self.horizontalSlider_6.value()
                self.lineEdit_6.setText(str(servoAngle6))
                PWM.setPWMServoPulse(6, servoAngle6 + self.deviation_data[str(6)], 20)
            
