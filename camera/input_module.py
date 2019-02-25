import module

import logging
import flask

## Note: Define constants in parent class (module.py)

#--------------------
# Input Service Class
#--------------------
class Input(module.Module):

	@staticmethod
	def start_service(controller):
		"""
		"""

		## Don't start service if not connected
		## to server
		if not controller.is_connected:
			return None 

		## Initialize flask service and logger
		global logger
		service = flask.Flask(__name__)
		logger = logging.getLogger(__name__)
		kwargs = {"host": "0.0.0.0",
							"port": controller.port,
							"debug": controller.debug,
							"use_reloader": False}

		@service.route("/start", methods=["GET"])
		def start_recording():
			"""
			"""
			
			## EXAMPLE MESSAGES
			# msg = {module.DATA: "from input", 
			# 			 module.LOCATION: module.MOTOR_MODULE}
			# controller.module_message(msg, from_module=Input())

			# msg = {module.DATA: "from input", 
			# 			 module.LOCATION: module.CAMERA_MODULE}
			# controller.module_message(msg)

			# msg = {module.DATA: "from input", 
			# 			 module.LOCATION: module.INPUT_MODULE}
			# controller.module_message(msg)

			logger.debug("start_recording() returned")
			return "start recording"

		@service.route("/stop", methods=["GET"])
		def stop_recording():
			"""
			"""

			logger.debug("stop_recording() returned")
			return "stop recording"

		@service.route("/rotate", methods=["GET"])
		def rotate_camera():
			"""
			"""

			## Get directional parameters
			direction = flask.request.args.get("direction")
			if direction is None:
				return "no direction specified"

			logger.debug("rotate_camera() returned")
			return "rotate left " if direction == "left" else "rotate right"

		@service.route("/cleanup", methods=["GET"])
		def shutdown_system():
			"""
			"""

			## Get shutdown parameter
			shutdown = flask.request.args.get("shutdown")
			if shutdown is None:
				shutdown = False

			## Attempt to cleanup system
			try:
				controller.cleanup(shutdown=shutdown)
			except RuntimeError as e:
				logger.error("service not shutdown - " + str(e))
				return "service not shutdown - " + str(e)
			except:
				logger.error("service not shutdown")
				return "service not shutdown"

			logger.debug("shutdown_system() returned")
			return "system shutdown"

		## Starting service and initialize 
		## modules in controller
		controller.initialize()
		service.run(**kwargs)
		return service

	@staticmethod
	def cleanup():
		"""Static method to shutdown flask service.

		Raise: RuntimeError - invalid server running

		Returns: None
		"""

		## Gets flask shutdown mehtod
		shutdown = flask.request.environ.get("werkzeug.server.shutdown")
		if shutdown is None:
			raise RuntimeError("must run with Werkzeug Server")
		
		## Turns off flask service
		shutdown()

		logger.debug("cleanup() returned")
		return None

	@staticmethod
	def controller_message(message):
		"""

		Key arguments:
		message - message data received from controller

		Returns: None
		"""

		if module.ERROR in message:
			logger.error("error sending message - " + str(message))
			return None

		if module.SUCCESS in message:
			logger.debug("message received - " + str(message))
			return None

		if module.DATA not in message:
			logger.warning("message received with no data - " + str(message))
			return None

		## TODO: Create message types switchboard
		data = message[module.DATA]
		
		logger.debug("message data - " + str(data))
		logger.debug("controller_message() returned")
		return None