from main_controller import Controller
from input_module import Input
from motor_module import Motor
from camera_module import Camera

import unittest

class TestController(unittest.TestCase):
	
	def setUp(self):
		self.controller = Controller()

	def test_unittest(self):
		self.assertEqual(50, 20)

class TestInput(unittest.TestCase):
	
	def setUp(self):
		self.input = Input()

class TestMotor(unittest.TestCase):
	
	def setUp(self):
		self.motor = Motor()

class TestCamera(unittest.TestCase):
	
	def setUp(self):
		self.camera = Camera()

if __name__ == "__main__":
	runner = unittest.main()