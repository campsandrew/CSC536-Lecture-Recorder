from main_controller import Controller
from camera_module import Camera
from input_module import Input
from motor_module import Motor

import unittest

#----------------------
# Controller Test Class
#----------------------
class TestController(unittest.TestCase):
	
	def setUp(self):
		self.controller = Controller()

	#def test_unittest(self):
	#	self.assertEqual(50, 20)

#-----------------
# Input Test Class
#-----------------
class TestInput(unittest.TestCase):
	
	def setUp(self):
		self.input = Input()

#-----------------
# Motor Test Class
#-----------------
class TestMotor(unittest.TestCase):
	
	def setUp(self):
		self.motor = Motor()

#------------------
# Camera Test Class
#------------------
class TestCamera(unittest.TestCase):
	
	def setUp(self):
		self.camera = Camera()

#------------
# Entry Point
#------------
if __name__ == "__main__":
	runner = unittest.main()