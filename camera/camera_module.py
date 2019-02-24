from module import Module

import logging

#--------------------
# Camera Module Class
#--------------------
class Camera(Module):

	def __init__(self):
		"""
		"""

		self.logger = logging.getLogger(__name__)

		self.logger.debug("__init__() returned")
		return None