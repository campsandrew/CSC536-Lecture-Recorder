import logging
import flask

#--------------------
# Input Service Class
#--------------------
class Input:

	@staticmethod
	def input_service(controller):
		"""
		"""

		## Don't start service if not connected
		## to server
		if not controller.is_connected:
			return None 

		## Initialize flask service and logger
		service = flask.Flask(__name__)
		logger = logging.getLogger(__name__)
		kwargs = {"port": controller.port,
							"debug": controller.debug}

		@service.route("/start", methods=["GET"])
		def start_recording():
			"""
			"""

			## Initialize modules in controller
			controller.initialize()

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

			direction = flask.request.args.get("direction")
			if not direction:
				return "no direction specified"

			logger.debug("rotate_camera() returned")
			return "rotate left " if direction == "left" else "rotate right"

		## Starting service
		service.run(**kwargs)
		return service