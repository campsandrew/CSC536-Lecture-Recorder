from camera_module import Camera
from input_module import Input
from motor_module import Motor

import logging
import json
import sys
import os

## Constants
## Note: These module names could be python 
## Enums eventually
CONTROLLER = "controller"
INPUT_MODULE = "input"
MOTOR_MODULE = "motor"
CAMERA_MODULE = "camera"
CONFIG_FILE = "config.json"
DEBUG = "debug"

#------------
# Entry Point
#------------
def main():
	"""Main method initializes controller
	with JSON configuration file.

	Returns: None
	"""

	# Create controller instance
	controller = Controller()

	

	# Initialize controller modules
	controller.initialize()

	logging.debug("main returned")
	return None

#----------------------
# Main Controller Class
#----------------------
class Controller:

	def __new__(cls, filepath=CONFIG_FILE):
		"""Creates instance of class. Initializes
		logger.

		Returns: self - instance of class
		"""

		cls._config = cls.get_configuration(filepath)
		cls.debug = cls._config[CONTROLLER][DEBUG]
		cls.logger = logging.getLogger()
		
		# Initialize logging
		if cls.debug:
			cls.logger.setLevel(logging.DEBUG)

		instance = super(Controller, cls).__new__(cls)
		return instance

	def __init__(self, filepath=CONFIG_FILE):
		"""Initializes class attributes.

		Keyword arguments:
		filepath - JSON file with system configurations
		"""

		## Public

		## Private
		self._motor_module = Motor()
		self._input_module = Input()
		self._camera_module = Camera()
		self._modules = {
			INPUT_MODULE: self._input_module,
			MOTOR_MODULE: self._motor_module,
			CAMERA_MODULE: self._camera_module
		}

		self.logger.debug("__init__() returned")
		return None

	def initialize(self):
		"""Calls initialize method on all registered
		modules. Each module will get passed a message 
		callback method and individual configuration
		read from JSON file. Controller debug config is
		passed through to all module configs

		Returns: None
		"""

		# Call init methods on all modules
		for name, module in self._modules.items():
			config = self._config[name]
			config[DEBUG] = self.debug
			module.initialize(self.module_message, config)

		self.logger.debug("initialize() returned")
		return None

	def module_message(self, module, message, callback):
		"""Receive message from module and send message
		to specific module controller method.

		Keyword arguments:
		module - current instance of module sending message
		message - any data passed to module controller method
		callback - method to call after message is received

		Returns: None
		"""

		if isinstance(module, Input):
			logging.debug("input message directed")
			self._input_control(message, callback)

		elif isinstance(module, Camera):
			logging.debug("camera message directed")
			self._camera_control(message, callback)

		elif isinstance(module, Motor):
			logging.debug("motor message directed")
			self._motor_control(message, callback)

		else:
			logging.debug("unknown message received")
			## Unknown module message
			## Do nothing
			pass

		logging.debug("module_message() returned")
		return None

	def _input_control(self, message, callback):
		"""
		"""

		return None

	def _motor_control(self, message, callback):
		return None

	def _camera_control(self, message, callback):
		return None

	def cleanup(self, shutdown=False):
		"""Calls cleanup method on all registered modules.

		Keyword arguments:
		shutdown - boolean to trigger system shutdown

		Returns: None
		"""

		# Call cleanup methods on all modules
		for name, module in self._modules.items():
			module.cleanup()

		# Turn off computer
		if shutdown:
			logging.warning("system shutting down")
			os.system("shutdown -s")

		logging.debug("cleanup() returned")
		return None

	@classmethod
	def get_configuration(cls, filepath):
		"""Class method to read a JSON config file
		with module specific configurations passed to
		each module when an instance is created. If config
		file fails to open, the cleanup method is called
		and the program exits with exit code -1

		Keyword arguments:
		filepath - JSON configuration filepath

		Return:
		config - dictionary with the config for each module
		"""

		# Attempt to read config file
		try:
			file = open(filepath, "r")
			config = json.load(file)
		except:
			logging.error("Could not open " + filepath)
			logging.info("Cleaning up....")
			cls.cleanup()
			sys.exit(-1)

		logging.debug("get_configuration() returned")
		return config

if __name__ == "__main__":
	main()