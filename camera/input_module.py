from module import Module
from flask import Flask

import logging
import socket

DEBUG = "debug"
CONFIG_SERVER = "server"

#-------------------
# Input Module Class
#-------------------
class Input(Module):

	def __init__(self):
		"""Declare class attributes and initialize
		logger

		Returns: None
		"""

		## Public
		self.is_connected = False
		self.logger = logging.getLogger(__name__)
		
		## Private
		self._config = None
		self._callback = None
		self._service = Flask(__name__)


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
		self.is_connected = self._has_connection(config[CONFIG_SERVER])

		self.logger.debug("initialize() returned")
		return None

	def _has_connection(self, hostname, port=80, timeout=2):
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