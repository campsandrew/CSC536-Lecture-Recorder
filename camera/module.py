import logging

DEBUG = "debug"

class Module:

	def __init__(self):
		"""

		Returns: None
		"""

		self._callback = None
		self._config = None
		self.logger = logging.getLogger(__name__)

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

		self._callback = callback
		self._config = config

		self.logger.debug("initialize() returned")
		return None

	def controller_message(self, message):
		"""

		Key arguments:
		message - message data received from controller

		Returns: None
		"""

		self.logger.debug("message received - " + str(message))
		self.logger.debug("controller_message() returned")
		return None

	def cleanup(self):
		"""

		Returns: None
		"""

		self.logger.debug("cleanup() returned")
		return None