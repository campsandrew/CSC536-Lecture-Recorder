from camera_module import Camera
from motor_module import Motor
from input_module import Input

import logging
import socket
import json
import sys
import os

## Constants
## Note: These module names could be python 
## Enums eventually
CONTROLLER = "controller"
MOTOR_MODULE = "motor"
CAMERA_MODULE = "camera"
INPUT_MODULE = "input"
CONFIG_FILE = "config.json"
PORT = "port"
SERVER = "server"
DEBUG = "debug"
LOCATION = "location"
ERROR = "error"
SUCCESS = "success"

#------------
# Entry Point
#------------
def main():
	"""Main method initializes controller
	with JSON configuration file. Start

	Returns: None
	"""

	# Create controller instance
	controller = Controller()

	controller.logger.debug("main() returned")
	return None

#----------------------
# Main Controller Class
#----------------------
class Controller:

	def __new__(cls, filepath=CONFIG_FILE):
		"""Creates instance of class and initializes
		logger

		Returns: self - instance of class
		"""

		cls._config = cls.get_configuration(filepath)
		cls.debug = cls._config[CONTROLLER][DEBUG]
		cls.logger = logging.getLogger()

		# Initialize logger
		logging.basicConfig()
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
		self.port = self._config[CONTROLLER][PORT]
		self.server = self._config[CONTROLLER][SERVER]
		self.is_connected = self.has_connection(self.server)
		self.service = None

		## Private
		self._motor_module = Motor()
		self._camera_module = Camera()
		self._input_module = Input()
		self._modules = {
			MOTOR_MODULE: self._motor_module,
			CAMERA_MODULE: self._camera_module,
			INPUT_MODULE: self._input_module
		}

		self.service = self._input_module.start_service(self)

		self.logger.debug("__init__() returned")
		return None

	def initialize(self):
		"""Calls initialize method on all registered
		modules. Each module will get passed a message 
		callback method and individual configuration
		read from JSON file. Controller debug config is
		passed through to all module configs.

		Returns: None
		"""

		# Call init methods on all modules
		for name, module in self._modules.items():
			config = self._config[name]
			config[DEBUG] = self.debug
			module.initialize(self.module_message, config)

		self.logger.debug("initialize() returned")
		return None

	def module_message(self, module, message):
		"""Receive message from module and send message
		to specific module controller method.

		Keyword arguments:
		module - current instance of module sending message
		message - any data passed to module controller method
		that must of LOCATION

		Returns: None
		"""

		callback = None

		if isinstance(module, Camera):
			callback = self._camera_module.controller_message
			self.logger.debug("camera message directed")

		elif isinstance(module, Motor):
			callback = self._motor_module.controller_message
			self.logger.debug("motor message directed")

		elif isinstance(module, Input):
			callback = self._input_module.controller_message
			self.logger.debug("motor message directed")

		else:
			self.logger.debug("unknown message received")
			callback = module.controller_message
			## Unknown module message
			## Do nothing
			pass

		## Message direction switchboard called
		self._direct_message(message, callback)

		self.logger.debug("module_message() returned")
		return True

	def _direct_message(self, message, callback):
		"""
		"""

		return_message = {}

		## Error message sent back if not message location
		## specified
		if LOCATION not in message:
			return_message[ERROR] = "no message location"

		elif message[LOCATION] == MOTOR_MODULE:
			self._motor_module.controller_message(message)
			return_message[SUCCESS] = "message sent to motor"

		elif message[LOCATION] == CAMERA_MODULE:
			self._camera_module.controller_message(message)
			return_message[SUCCESS] = "message sent to camera"

		elif message[LOCATION] == INPUT_MODULE:
			self._input_module.controller_message(message)
			return_message[SUCCESS] ="message sent to input"

		else:
			return_message[ERROR] = "unknown message location"

		callback(return_message)
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
			self.logger.warning("system shutting down")
			os.system("shutdown -s")

		self.logger.debug("cleanup() returned")
		return None

	@classmethod
	def has_connection(cls, hostname, port=80, timeout=2):
		"""Performs a test connection to server.

		Key arguments:
		hostname - url of server
		port - port of server
		timeout - time spent waiting for connection

		Returns:
		connected - boolean of connection
		"""

		connected = True

		try:
			host = socket.gethostbyname(hostname)
			connect = socket.create_connection((host, port), timeout)
		except:
			cls.logger.warning("no connection to server")
			connected = False

		cls.logger.debug("has_connection() returned " + str(connected))
		return connected

	@staticmethod
	def get_configuration(filepath):
		"""Static method to read a JSON config file
		with module specific configurations passed to
		each module when an instance is created. If config
		file fails to open and the program exits with exit code -1

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
			logging.info("Exiting with status code -1")
			sys.exit(-1)

		return config

if __name__ == "__main__":
	main()