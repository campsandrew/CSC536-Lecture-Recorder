from main_controller import Controller
from camera_module import Camera
from motor_module import Motor
from input_module import Input

import unittest

#----------------------
# Controller Test Class
#----------------------
class TestController(unittest.TestCase):
	
	def setUp(self):
		self.controller = Controller()

	def test_success_message_modules(self):
		pass

	def test_error_message_modules(self):
		pass

	def test_receive_message_modules(self):
		pass

	#def test_unittest(self):
	#	self.assertEqual(50, 20)

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

#-----------------
# Input Test Class
#-----------------
class TestInput(unittest.TestCase):
	
	def setUp(self):
		pass

#------------
# Entry Point
#------------
if __name__ == "__main__":
	runner = unittest.main()