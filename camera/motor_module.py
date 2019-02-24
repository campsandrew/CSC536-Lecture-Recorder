from module import Module

import logging

#-------------------
# Motor Module Class
#-------------------
class Motor(Module):

	def __init__(self):
		"""
		"""

		self.logger = logging.getLogger(__name__)

		self.logger.debug("__init__() returned")
		return None