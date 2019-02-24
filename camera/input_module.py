from module import Module
from flask import Flask

import logging
import socket

CONFIG_SERVER = "server"

#-------------------
# Input Module Class
#-------------------
class Input(Module):

	def __init__(self):
		"""
		"""

		## Initialize class attributes
		self.is_connected = False
		self.config = None
		self._callback = None
		self.logger = logging.getLogger(__name__)

		self.logger.debug("__init__() returned")
		return None

	def initialize(self, callback, config):
		self._callback = callback
		self._config = config
		self.is_connected = self._has_connection(config[CONFIG_SERVER])
		self._callback(self, "test", self.controller_message)

		self.logger.debug("initialize() returned")
		return None

	def _has_connection(self, hostname, port=80, timeout=2):
		"""
		"""

		connected = True

		try:
			host = socket.gethostbyname(hostname)
			connect = socket.create_connection((host, port), timeout)
		except:
			self.logger.warning("no connection to server")
			connected = False

		self.logger.debug("_has_connection() returned " + str(connected))
		return connected

	def controller_message(self, message):
		"""
		"""
		self.logger.debug("message received - " + str(message))
		self.logger.debug("controller_message() returned")
		return None