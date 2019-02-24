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
INPUT_MODULE = "input"
MOTOR_MODULE = "motor"
CAMERA_MODULE = "camera"
CONFIG_FILE = "config.json"
DEBUG = True

#------------
# Entry Point
#------------
def main():
	"""Main method initializes controller
	with JSON configuration file and logging
	is initialized.

	Returns: None
	"""

	# Initialize logging
	if DEBUG: logging.basicConfig(level=logging.DEBUG)
	else: logging.basicConfig()

	# Create controller instance
	controller = Controller().initialize()

	logging.debug("main returned")
	return None

#----------------------
# Main Controller Class
#----------------------
class Controller:

	def __new__(cls):
		"""Creates instance of class.

		Returns: self - instance of class
		"""

		instance = super(Controller, cls).__new__(cls)
		return instance

	def __init__(self, filepath=CONFIG_FILE):
		"""Initializes class attributes.

		Keyword arguments:
		filepath - JSON file with system configurations
		"""

		self._config = None
		self._config_filepath = filepath
		self._motor_module = Motor()
		self._input_module = Input()
		self._camera_module = Camera()
		self._modules = {
			INPUT_MODULE: self._input_module,
			MOTOR_MODULE: self._motor_module,
			CAMERA_MODULE: self._camera_module
		}

		logging.debug("__init__() returned")
		return None

	def initialize(self):
		"""Calls initialize method on all registered
		modules. Each module will get passed a message 
		callback method and individual configuration
		read from JSON file.

		Returns: self - instance of class
		"""

		self._config = self.get_configuration(self._config_filepath)

		# Call init methods on all modules
		for name, module in self._modules.items():
			config = self._config[name]
			module.initialize(self.module_message, config)

		logging.debug("initialize() returned")
		return self

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

	def get_configuration(self, filepath):
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
			self.cleanup()
			sys.exit(-1)

		logging.debug("get_configuration() returned")
		return config

if __name__ == "__main__":
	main()