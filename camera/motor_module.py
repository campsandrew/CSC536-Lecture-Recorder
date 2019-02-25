import module

import logging

## Note: Define constants in parent class (module.py)

#-------------------
# Motor Module Class
#-------------------
class Motor(module.Module):

	def __init__(self):
		"""
		"""

		## Public
		self.logger = logging.getLogger(__name__)

		## Private
		self._send_message = None
		self._config = None

		self.logger.debug("__init__() returned")
		return None

	def initialize(self, callback, config):
		"""

		Key arguments:
		callback - function to call to send message to
		controller
		config - dictionary of configuration from config file

		Returns: None
		"""

		self._send_message = callback
		self._config = config

		## EXAMPLE MESSAGES
		# msg = {module.LOCATION: module.INPUT_MODULE, 
		# 			 module.DATA: "from motor"}
		# self._send_message(self, msg)

		# msg = {module.LOCATION: module.CAMERA_MODULE, 
		# 			 module.DATA: "from motor"}
		# self._send_message(self, msg)

		# msg = {module.LOCATION: module.MOTOR_MODULE, 
		# 			 module.DATA: "from motor"}
		# self._send_message(self, msg)

		self.logger.debug("initialize() returned")
		return None

	def cleanup(self):
		"""

		Returns: None
		"""

		self.logger.debug("cleanup() returned")
		return None

	def controller_message(self, message):
		"""

		Key arguments:
		message - message data received from controller

		Returns: None
		"""

		if module.ERROR in message:
			self.logger.error("error sending message")
			return None

		if module.SUCCESS in message:
			self.logger.debug("message received - " + str(message))
			return None

		if module.DATA not in message:
			self.logger.warning("message received with no data")
			return None

		## TODO: Create message types switchboard
		data = message[module.DATA]

		self.logger.debug("message data - " + str(data))
		self.logger.debug("controller_message() returned")
		return None