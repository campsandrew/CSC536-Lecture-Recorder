import logging

class Module:

	def __init__(self):
		"""
		"""

		self._callback = None
		self._config = None
		self.logger = logging.getLogger(__name__)

		self.logger.debug("__init__() returned")
		return None

	def initialize(self, callback, config):
		"""
		"""

		self._callback = callback
		self._config = config

		self.logger.debug("initialize() returned")
		return None

	def controller_message(self, message):

		self.logger.debug("message received - " + str(message))
		self.logger.debug("controller_message() returned")
		return None

	def cleanup(self):

		self.logger.debug("cleanup() returned")
		return None