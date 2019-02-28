import logging

## Constants
MOTOR_MODULE = "motor"
CAMERA_MODULE = "camera"
INPUT_MODULE = "input"
LOCATION = "location"
ERROR = "error"
SUCCESS = "success"
DEBUG = "debug"
DATA = "data"

class Module:

	def __init__(self):
		"""

		Returns: None
		"""

		## Private
		self._send_message = None
		self._config = None

		## Public
		self.logger = logging.getLogger(__name__)

		self.logger.debug("__init__() returned")
		return None

	def initialize(self, callback, config):
		"""General module initialize method.

		Key arguments:
		callback - function to call to send message to
		controller
		config - dictionary of configuration from config file

		Returns: None
		"""

		self._send_message = callback
		self._config = config

		self.logger.debug("initialize() returned")
		return None

	def cleanup(self):
		"""General module cleanup method.

		Returns: None
		"""

		self.logger.debug("cleanup() returned")
		return None

	def controller_message(self, message):
		"""General module message callback method.

		Key arguments:
		message - message data received from controller

		Returns: None
		"""

		if ERROR in message:
			self.logger.error("error sending message")
			return None

		if SUCCESS in message:
			self.logger.debug("message received - " + str(message))
			return None

		if DATA not in message:
			self.logger.warning("message received with no data")
			return None

		## Default: do nothing with message in
		## general module class
		data = message[DATA]

		self.logger.debug("message data - " + str(data))
		self.logger.debug("controller_message() returned")
		return None