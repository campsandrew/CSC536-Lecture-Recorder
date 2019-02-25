from main_controller import Controller
from camera_module import Camera
from motor_module import Motor
from input_module import Input
import module

import unittest

#----------------------
# Controller Test Class
#----------------------
class TestController(unittest.TestCase):
	
	def setUp(self):
		#self.controller = Controller()
		self.input = Input()
		self.motor = Motor()
		self.camera = Camera()

	# def test_success_message_modules(self):
	# 	pass

	# def test_error_message_modules(self):
	# 	pass

	# def test_receive_message_modules(self):
	# 	pass

	# # Example test
	# def test_unittest(self):
	# 	self.assertEqual(50, 20)

#-----------------
# Motor Test Class
#-----------------
class TestMotor(unittest.TestCase):
	
	def setUp(self):
		self.controller = Controller()

	def test_message_camera(self):
		"""
		"""

		msg = {module.DATA: "motor",
					 module.LOCATION: module.CAMERA_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Motor())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_input(self):
		"""
		"""

		msg = {module.DATA: "motor",
					 module.LOCATION: module.INPUT_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Motor())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_self(self):
		"""
		"""

		msg = {module.DATA: "motor", 
		 			 module.LOCATION: module.MOTOR_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Motor())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_fail(self):
		"""
		"""

		msg = {module.DATA: "motor"}
		with_origin = self.controller.module_message(msg, from_module=Motor())
		no_origin = self.controller.module_message(msg)

		self.assertFalse(with_origin)
		self.assertFalse(no_origin)
		return None

#------------------
# Camera Test Class
#------------------
class TestCamera(unittest.TestCase):
	
	def setUp(self):
		self.controller = Controller()

	def test_message_input(self):
		"""
		"""

		msg = {module.DATA: "camera",
					 module.LOCATION: module.INPUT_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Camera())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_motor(self):
		"""
		"""

		msg = {module.DATA: "camera",
					 module.LOCATION: module.MOTOR_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Camera())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_self(self):
		"""
		"""

		msg = {module.DATA: "camera", 
		 			 module.LOCATION: module.CAMERA_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Camera())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_fail(self):
		"""
		"""

		msg = {module.DATA: "camera"}
		with_origin = self.controller.module_message(msg, from_module=Camera())
		no_origin = self.controller.module_message(msg)

		self.assertFalse(with_origin)
		self.assertFalse(no_origin)
		return None

#-----------------
# Input Test Class
#-----------------
class TestInput(unittest.TestCase):
	
	def setUp(self):
		self.controller = Controller()

	def test_message_camera(self):
		"""
		"""

		msg = {module.DATA: "input",
					 module.LOCATION: module.CAMERA_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Input())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_motor(self):
		"""
		"""

		msg = {module.DATA: "input",
					 module.LOCATION: module.MOTOR_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Input())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_self(self):
		"""
		"""

		msg = {module.DATA: "input", 
		 			 module.LOCATION: module.INPUT_MODULE}
		with_origin = self.controller.module_message(msg, from_module=Input())
		no_origin = self.controller.module_message(msg)

		self.assertTrue(with_origin)
		self.assertTrue(no_origin)
		return None

	def test_message_fail(self):
		"""
		"""

		msg = {module.DATA: "input"}
		with_origin = self.controller.module_message(msg, from_module=Input())
		no_origin = self.controller.module_message(msg)

		self.assertFalse(with_origin)
		self.assertFalse(no_origin)
		return None

#------------
# Entry Point
#------------
if __name__ == "__main__":
	runner = unittest.main()