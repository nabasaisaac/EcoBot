import time
import Board

print('''
**********************************************************
******** Function: expansion board buzzer demo *********
**********************************************************
----------------------------------------------------------


----------------------------------------------------------
Tips:
 * Press Ctrl+C to stop the program (try multiple times if needed).
----------------------------------------------------------
''')

Board.setBuzzer(0) # Off

Board.setBuzzer(1) # On
time.sleep(0.1) # Delay
Board.setBuzzer(0) # Off

time.sleep(1) # Delay

Board.setBuzzer(1)
time.sleep(0.5)
Board.setBuzzer(0)