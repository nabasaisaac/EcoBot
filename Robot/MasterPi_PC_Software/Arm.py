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
            
                
    # Keep deviation sliders in sync and preview servo offsets
    def valuechange2(self, name):
        if not self.resetServos_:
            if name == 'd1':
                self.devNew[0] = self.horizontalSlider_11.value()
                self.label_d1.setText(str(self.devNew[0]))
                PWM.setPWMServoPulse(1, self.horizontalSlider_1.value() + self.devNew[0], 20)
            if name == 'd3':
                self.devNew[1] = self.horizontalSlider_13.value()
                self.label_d3.setText(str(self.devNew[1]))
                PWM.setPWMServoPulse(3, self.horizontalSlider_3.value() + self.devNew[1], 20)
            if name == 'd4':
                self.devNew[2] = self.horizontalSlider_14.value()
                self.label_d4.setText(str(self.devNew[2]))
                PWM.setPWMServoPulse(4, self.horizontalSlider_4.value() + self.devNew[2], 20)       
            if name == 'd5':
                self.devNew[3] = self.horizontalSlider_15.value()
                self.label_d5.setText(str(self.devNew[3]))
                PWM.setPWMServoPulse(5, self.horizontalSlider_5.value() + self.devNew[3], 20)
                           
            if name == 'd6':
                self.devNew[4] = self.horizontalSlider_16.value()
                self.label_d6.setText(str(self.devNew[4]))
                PWM.setPWMServoPulse(6, self.horizontalSlider_6.value() + self.devNew[4], 20)      

    # Reset button click handler
    def button_re_clicked(self, name):
        self.resetServos_ = True
        if name == 'reSetServos':
            self.deviation_data = self.get_yaml_data(self.path + self.Deviation_file)
            data = [1500,5, 1,1500+self.deviation_data[str(1)],
                            3,1500+self.deviation_data[str(3)],
                            4,1500+self.deviation_data[str(4)],
                            5,1500+self.deviation_data[str(5)],
                            6,1500+self.deviation_data[str(6)]]
            PWM.setPWMServosPulse(data)
            data.clear()
            self.lineEdit_1.setText('1500')
            self.lineEdit_3.setText('1500')
            self.lineEdit_4.setText('1500')
            self.lineEdit_5.setText('1500')
            self.lineEdit_6.setText('1500')
            self.horizontalSlider_1.setValue(1500)
            self.horizontalSlider_3.setValue(1500)
            self.horizontalSlider_4.setValue(1500)
            self.horizontalSlider_5.setValue(1500)
            self.horizontalSlider_6.setValue(1500)
            
#             self.label_d1.setText('0')
#             self.label_d3.setText('0')
#             self.label_d4.setText('0')
#             self.label_d5.setText('0')
#             self.label_d6.setText('0')
#             self.horizontalSlider_11.setValue(0)
#             self.horizontalSlider_13.setValue(0)
#             self.horizontalSlider_14.setValue(0)
#             self.horizontalSlider_15.setValue(0)
#             self.horizontalSlider_16.setValue(0) 
            self.resetServos_ = False
            
    # Tab selection handler: load corresponding servo values
    def tabindex(self, index):       
        return  [str(self.horizontalSlider_1.value()), 
                 str(self.horizontalSlider_3.value()),
                 str(self.horizontalSlider_4.value()),
                 str(self.horizontalSlider_5.value()),
                 str(self.horizontalSlider_6.value())]
    
    def getIndexData(self, index):
        data = []
        for j in range(2, self.tableWidget.columnCount()):
            data.append(str(self.tableWidget.item(index, j).text()))
        return data
    
    # Add a row to the action table
    def add_line(self, item, timer, id1, id3, id4, id5, id6):
        self.tableWidget.setItem(item, 1, QtWidgets.QTableWidgetItem(str(item + 1)))
        self.tableWidget.setItem(item, 2, QtWidgets.QTableWidgetItem(timer))
        self.tableWidget.setItem(item, 3, QtWidgets.QTableWidgetItem(id1))
        self.tableWidget.setItem(item, 4, QtWidgets.QTableWidgetItem(id3))
        self.tableWidget.setItem(item, 5, QtWidgets.QTableWidgetItem(id4))
        self.tableWidget.setItem(item, 6, QtWidgets.QTableWidgetItem(id5))
        self.tableWidget.setItem(item, 7, QtWidgets.QTableWidgetItem(id6))

    # Add the "running" icon to the active row
    def icon_position(self):
        toolButton_run = QtWidgets.QToolButton()
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap(":/images/index.png"), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        toolButton_run.setIcon(icon)
        toolButton_run.setObjectName("toolButton_run")
        item = self.tableWidget.currentRow()
        self.tableWidget.setCellWidget(item, 0, toolButton_run)
        for i in range(self.tableWidget.rowCount()):
            if i != item:
                self.tableWidget.removeCellWidget(i, 0)
        toolButton_run.clicked.connect(self.action_one)

    def action_one(self):
        self.resetServos_ = True
        item = self.tableWidget.currentRow()
        try:
            self.deviation_data = self.get_yaml_data(self.path + self.Deviation_file)
            timer = int(self.tableWidget.item(self.tableWidget.currentRow(), 2).text())
            ServoPulse_1 = int(self.tableWidget.item(self.tableWidget.currentRow(), 3).text())
            ServoPulse_3 = int(self.tableWidget.item(self.tableWidget.currentRow(), 4).text())
            ServoPulse_4 = int(self.tableWidget.item(self.tableWidget.currentRow(), 5).text())
            ServoPulse_5 = int(self.tableWidget.item(self.tableWidget.currentRow(), 6).text())
            ServoPulse_6 = int(self.tableWidget.item(self.tableWidget.currentRow(), 7).text())
            self.horizontalSlider_1.setValue(ServoPulse_1)
            self.horizontalSlider_3.setValue(ServoPulse_3)
            self.horizontalSlider_4.setValue(ServoPulse_4)
            self.horizontalSlider_5.setValue(ServoPulse_5)
            self.horizontalSlider_6.setValue(ServoPulse_6)
            self.lineEdit_1.setText(str(ServoPulse_1))
            self.lineEdit_3.setText(str(ServoPulse_3))
            self.lineEdit_4.setText(str(ServoPulse_4))
            self.lineEdit_5.setText(str(ServoPulse_5))
            self.lineEdit_6.setText(str(ServoPulse_6))
            
            data = [timer,5, 1,ServoPulse_1 + self.deviation_data[str(1)],
                             3,ServoPulse_3 + self.deviation_data[str(3)],
                             4,ServoPulse_4 + self.deviation_data[str(4)],
                             5,ServoPulse_5 + self.deviation_data[str(5)],
                             6,ServoPulse_6 + self.deviation_data[str(6)]]
            PWM.setPWMServosPulse(data)
            data.clear()
            time.sleep(0.01)
            
        except Exception:
            self.message_From('Run error')
        self.resetServos_ = False

    # Action group edit button click handler
    def button_editaction_clicked(self, name):
        list = self.tabindex(self.tabWidget.currentIndex())
        RowCont = self.tableWidget.rowCount()
        item = self.tableWidget.currentRow()
                   
        if name == 'addAction':    # Add action
            if int(self.lineEdit_time.text()) < 20:
                self.message_From('Run time must be greater than 20')
                return
            self.tableWidget.insertRow(RowCont)    # Add a row
            self.tableWidget.selectRow(RowCont)    # Select last row
            self.add_line(RowCont, str(self.lineEdit_time.text()), list[0], list[1], list[2], list[3], list[4])
            self.totalTime += int(self.lineEdit_time.text())
            self.label_TotalTime.setText(str((self.totalTime)/1000.0))
        if name == 'delectAction':    # Delete action
            if RowCont != 0:
                self.totalTime -= int(self.tableWidget.item(item, 2).text())
                self.tableWidget.removeRow(item)  # Delete selected row
                self.label_TotalTime.setText(str((self.totalTime)/1000.0))
        if name == 'delectAllAction':
            result = self.message_delect('This will delete all actions in the list. Continue?')
            if result == 0:                              
                for i in range(RowCont):
                    self.tableWidget.removeRow(0)
                self.totalTime = 0
                self.label_TotalTime.setText(str(self.totalTime))
            else:
                pass          
        if name == 'updateAction':    # Update action
            if int(self.lineEdit_time.text()) < 20:
                self.message_From('Run time must be greater than 20')
                return

            self.add_line(item, str(self.lineEdit_time.text()), list[0], list[1], list[2], list[3], list[4])
            self.totalTime = 0
            for i in range(RowCont):
                self.totalTime += int(self.tableWidget.item(i,2).text())
            self.label_TotalTime.setText(str((self.totalTime)/1000.0))            
        if name == 'insertAction':    # Insert action
            if item == -1:
                return
            if int(self.lineEdit_time.text()) < 20:
                self.message_From('Run time must be greater than 20')
                return

            self.tableWidget.insertRow(item)       # Insert a row
            self.tableWidget.selectRow(item)
            self.add_line(item, str(self.lineEdit_time.text()), list[0], list[1], list[2], list[3], list[4])
            self.totalTime += int(self.lineEdit_time.text())
            self.label_TotalTime.setText(str((self.totalTime)/1000.0))
        if name == 'moveUpAction':
            if item == 0 or item == -1:
                return
            current_data = self.getIndexData(item)
            uplist_data = self.getIndexData(item - 1)
            self.add_line(item - 1, current_data[0], current_data[1], current_data[2], current_data[3], current_data[4], current_data[5])
            self.add_line(item, uplist_data[0], uplist_data[1], uplist_data[2], uplist_data[3], uplist_data[4], uplist_data[5])
            self.tableWidget.selectRow(item - 1) 
        if name == 'moveDownAction':
            if item == RowCont - 1:
                return
            current_data = self.getIndexData(item)
            downlist_data = self.getIndexData(item + 1)           
            self.add_line(item + 1, current_data[0], current_data[1], current_data[2], current_data[3], current_data[4], current_data[5])
            self.add_line(item, downlist_data[0], downlist_data[1], downlist_data[2], downlist_data[3], downlist_data[4], downlist_data[5])
            self.tableWidget.selectRow(item + 1)
                             
        for i in range(self.tableWidget.rowCount()):    # Refresh index values
            self.tableWidget.item(i , 2).setFlags(self.tableWidget.item(i , 2).flags() & ~Qt.ItemIsEditable)
            self.tableWidget.setItem(i,1,QtWidgets.QTableWidgetItem(str(i + 1)))
        self.icon_position()
     
    # Online run button click handler
    def button_run(self, name):
        if self.tableWidget.rowCount() == 0:
            self.message_From('Please add an action first!')
        else:
            if name == 'run':
                 if self.Button_Run.text() == 'Run':
                    self.Button_Run.setText('Stop')
                    self.row = self.tableWidget.currentRow()
                    self.tableWidget.selectRow(self.row)
                    self.icon_position()
                    self.timer = QTimer()
                    self.t1 = time.time()
                    self.action_online(self.row)
                    if self.checkBox.isChecked():
                        for i in range(self.tableWidget.rowCount() - self.row):
                            s = self.tableWidget.item(i,2).text()
                            self.timer.start(int(s))       # Start timer interval
                        self.timer.timeout.connect(self.operate1)
                    else:
                        for i in range(self.tableWidget.rowCount() - self.row):
                            s = self.tableWidget.item(i,2).text()
                            self.timer.start(int(s))       # Start timer interval
                        self.timer.timeout.connect(self.operate2)
                 elif self.Button_Run.text() == 'Stop':
                    self.timer.stop()
                    self.Button_Run.setText('Run')
                    self.message_From('Run finished!')
            
    def operate1(self):
        item = self.tableWidget.currentRow()
        if item == self.tableWidget.rowCount() - 1:
            self.tableWidget.selectRow(self.row)
            self.action_online(self.row)
        else:
            self.tableWidget.selectRow(item + 1)
            self.action_online(item + 1)
        self.icon_position()

    def operate2(self):
        item = self.tableWidget.currentRow()
       
        if item == self.tableWidget.rowCount() - 1:
            self.timer.stop()
            self.tableWidget.selectRow(0)
            self.Button_Run.setText('Run')
            self.message_From('Run finished!')
        else:
            self.tableWidget.selectRow(item + 1)
            self.action_online(item + 1)
        self.icon_position()
    
    def action_online(self, item):
        self.resetServos_ = True
        try:
            self.deviation_data = self.get_yaml_data(self.path + self.Deviation_file)
            timer = int(self.tableWidget.item(self.tableWidget.currentRow(), 2).text())
            ServoPulse_1 = int(self.tableWidget.item(item, 3).text())
            ServoPulse_3 = int(self.tableWidget.item(item, 4).text())
            ServoPulse_4 = int(self.tableWidget.item(item, 5).text())
            ServoPulse_5 = int(self.tableWidget.item(item, 6).text())
            ServoPulse_6 = int(self.tableWidget.item(item, 7).text())
            
            self.horizontalSlider_1.setValue(ServoPulse_1)
            self.horizontalSlider_3.setValue(ServoPulse_3)
            self.horizontalSlider_4.setValue(ServoPulse_4)
            self.horizontalSlider_5.setValue(ServoPulse_5)
            self.horizontalSlider_6.setValue(ServoPulse_6)
            self.lineEdit_1.setText(str(ServoPulse_1))
            self.lineEdit_3.setText(str(ServoPulse_3))
            self.lineEdit_4.setText(str(ServoPulse_4))
            self.lineEdit_5.setText(str(ServoPulse_5))
            self.lineEdit_6.setText(str(ServoPulse_6))
            
            print("Deviation",self.deviation_data)
            data = [timer,5, 1,ServoPulse_1 + self.deviation_data[str(1)],
                             3,ServoPulse_3 + self.deviation_data[str(3)],
                             4,ServoPulse_4 + self.deviation_data[str(4)],
                             5,ServoPulse_5 + self.deviation_data[str(5)],
                             6,ServoPulse_6 + self.deviation_data[str(6)]]
            
            print("data",data)
            PWM.setPWMServosPulse(data)
            data.clear()
            
        except Exception:
            self.timer.stop()
            if self.chinese:
                self.Button_Run.setText('Run')
                self.message_From('Run error!')
            else:
                self.Button_Run.setText('Run')
                self.message_From('Run error!')              
        self.resetServos_ = False

    # File open/save button click handler
    def button_flie_operate(self, name):
        try:            
            if name == 'openActionGroup':
                dig_o = QFileDialog()
                dig_o.setFileMode(QFileDialog.ExistingFile)
                dig_o.setNameFilter('d6a Flies(*.d6a)')
                openfile = dig_o.getOpenFileName(self, 'OpenFile', '', 'd6a Flies(*.d6a)')
                # Open a single file
                # Arg1: parent widget; Arg2: dialog title
                # Arg3: default directory
                # Arg4: file filter, e.g. Image files(*.jpg *.gif)
                # Multiple filters are separated by ';;'
                path = openfile[0]
                try:
                    if path != '':
                        rbt = QSqlDatabase.addDatabase("QSQLITE")
                        rbt.setDatabaseName(path)
                        if rbt.open():
                            actgrp = QSqlQuery()
                            if (actgrp.exec("select * from ActionGroup ")):
                                self.tableWidget.setRowCount(0)
                                self.tableWidget.clearContents()
                                self.totalTime = 0
                                while (actgrp.next()):
                                    count = self.tableWidget.rowCount()
                                    self.tableWidget.setRowCount(count + 1)
                                    for i in range(7):
                                        self.tableWidget.setItem(count, i + 1, QtWidgets.QTableWidgetItem(str(actgrp.value(i))))
                                        if i == 1:
                                            self.totalTime += actgrp.value(i)
                                        self.tableWidget.update()
                                        self.tableWidget.selectRow(count)
                                    self.tableWidget.item(count, 2).setFlags(self.tableWidget.item(count , 2).flags() & ~Qt.ItemIsEditable)                                     
                        self.tableWidget.selectRow(0)
                        self.icon_position()
                        rbt.close()
                        self.label_TotalTime.setText(str(self.totalTime/1000.0))
                except:
                    self.message_From('Invalid action group')
                    
            if name == 'saveActionGroup':
                dig_s = QFileDialog()
                if self.tableWidget.rowCount() == 0:
                    self.message_From('The action list is empty. Nothing to save.')
                    return
                savefile = dig_s.getSaveFileName(self, 'Savefile', '', 'd6a Flies(*.d6a)')
                path = savefile[0]
                if os.path.isfile(path):
                    os.system('sudo rm ' + path)
                if path != '':                    
                    if path[-4:] == '.d6a':
                        conn = sqlite3.connect(path)
                    else:
                        conn = sqlite3.connect(path + '.d6a')
                    
                    c = conn.cursor()                    
                    c.execute('''CREATE TABLE ActionGroup([Index] INTEGER PRIMARY KEY AUTOINCREMENT
                    NOT NULL ON CONFLICT FAIL
                    UNIQUE ON CONFLICT ABORT,
                    Time INT,
                    Servo1 INT,
                    Servo3 INT,
                    Servo4 INT,
                    Servo5 INT,
                    Servo6 INT);''')                      
                    for i in range(self.tableWidget.rowCount()):
                        insert_sql = "INSERT INTO ActionGroup(Time, Servo1, Servo3, Servo4, Servo5, Servo6) VALUES("
                        for j in range(2, self.tableWidget.columnCount()):
                            if j == self.tableWidget.columnCount() - 1:
                                insert_sql += str(self.tableWidget.item(i, j).text())
                            else:
                                insert_sql += str(self.tableWidget.item(i, j).text()) + ','
                        
                        insert_sql += ");"
                        c.execute(insert_sql)
                    
                    conn.commit()
                    conn.close()
                    self.button_controlaction_clicked('reflash')
            
            if name == 'tandemActionGroup':
                dig_t = QFileDialog()
                dig_t.setFileMode(QFileDialog.ExistingFile)
                dig_t.setNameFilter('d6a Flies(*.d6a)')
                openfile = dig_t.getOpenFileName(self, 'OpenFile', '', 'd6a Flies(*.d6a)')
                # Open a single file
                # Arg1: parent widget; Arg2: dialog title
                # Arg3: default directory
                # Arg4: file filter, e.g. Image files(*.jpg *.gif)
                # Multiple filters are separated by ';;'
                path = openfile[0]
                try:
                    if path != '':
                        tbt = QSqlDatabase.addDatabase("QSQLITE")
                        tbt.setDatabaseName(path)
                        if tbt.open():
                            actgrp = QSqlQuery()
                            if (actgrp.exec("select * from ActionGroup ")):
                                while (actgrp.next()):
                                    count = self.tableWidget.rowCount()
                                    self.tableWidget.setRowCount(count + 1)
                                    for i in range(8):
                                        if i == 0:
                                            self.tableWidget.setItem(count, i + 1, QtWidgets.QTableWidgetItem(str(count + 1)))
                                        else:                      
                                            self.tableWidget.setItem(count, i + 1, QtWidgets.QTableWidgetItem(str(actgrp.value(i))))
                                        if i == 1:
                                            self.totalTime += actgrp.value(i)
                                        self.tableWidget.update()
                                        self.tableWidget.selectRow(count)
                                    self.tableWidget.item(count , 2).setFlags(self.tableWidget.item(count , 2).flags() & ~Qt.ItemIsEditable)
                        self.tableWidget.selectRow(0)
                        self.icon_position()
                        tbt.close()
                        self.label_TotalTime.setText(str(self.totalTime/1000.0))
                except:
                    if self.chinese:
                        self.message_From('Invalid action group')
                    else:
                        self.message_From('Wrong action format')
            if name == 'readDeviation':
                self.resetServos_ = True
                try:
                    self.deviation_data = self.get_yaml_data(self.path + self.Deviation_file)
                    deviation1 = self.deviation_data['1']
                    deviation3 = self.deviation_data['3']
                    deviation4 = self.deviation_data['4']
                    deviation5 = self.deviation_data['5']
                    deviation6 = self.deviation_data['6']
                    self.label_d1.setText(str(deviation1))
                    self.label_d3.setText(str(deviation3))
                    self.label_d4.setText(str(deviation4))
                    self.label_d5.setText(str(deviation5))
                    self.label_d6.setText(str(deviation6))
                    self.horizontalSlider_11.setValue(deviation1)
                    self.horizontalSlider_13.setValue(deviation3)
                    self.horizontalSlider_14.setValue(deviation4)
                    self.horizontalSlider_15.setValue(deviation5)
                    self.horizontalSlider_16.setValue(deviation6)
                    ServoPulse1 = self.horizontalSlider_1.value() + deviation1
                    ServoPulse3 = self.horizontalSlider_3.value() + deviation3
                    ServoPulse4 = self.horizontalSlider_4.value() + deviation4
                    ServoPulse5 = self.horizontalSlider_5.value() + deviation5
                    ServoPulse6 = self.horizontalSlider_6.value() + deviation6
                    
                    data = [150,5, 1,ServoPulse1, 3,ServoPulse3, 4,ServoPulse4, 5,ServoPulse5, 6,ServoPulse6]
                    PWM.setPWMServosPulse(data)
                    data.clear()
                    
                    if self.chinese:
                        self.message_From('Read complete')
                    
                except:
                    self.message_From('Read error!')
                self.resetServos_ = False
                    
            if name == 'saveDeviation':
                try:
                    data = {'1': self.horizontalSlider_11.value(),
                            '3': self.horizontalSlider_13.value(),
                            '4': self.horizontalSlider_14.value(),
                            '5': self.horizontalSlider_15.value(),
                            '6': self.horizontalSlider_16.value()}
                    self.save_yaml_data(data, self.path + self.Deviation_file)
                    self.message_From('Save complete')
                except:
                    self.message_From('Save error!')
                        
        except BaseException as e:
            print(e)
