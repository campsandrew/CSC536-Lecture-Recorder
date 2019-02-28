import module

import requests
import logging
import socket
import flask
import sys

## Input Module Specific Constants
HOST = "host"
SERVER = "server"
PORT = "port"

#--------------------
# Input Service Class
#--------------------
class Input(module.Module):

	@staticmethod
	def start_service(controller, config):
		"""
		"""

		global logger

		## Initialize flask service and logger
		service = flask.Flask(__name__)
		logger = logging.getLogger(__name__)
		kwargs = {"host": config[HOST],
							"port": config[PORT],
							"debug": config[module.DEBUG],
							"use_reloader": False}

		## Don't start service if not connected
		## to server
		parts = [config[SERVER], controller.deviceId, "ping"]
		status_url = "/".join(s.strip("/") for s in parts)
		params = {"address": socket.getfqdn() + ":" + str(config[PORT])}
		is_connected = Input.has_connection(status_url, params)
		if not is_connected:
			return None 

		@service.route("/status", methods=["GET"])
		def status_route():
			"""
			"""

			payload = {
				"success": True,
				"status": controller.status
			}

			logger.debug("status_route() return payload: " + str(payload))
			return flask.jsonify(payload);

		@service.route("/start", methods=["GET"])
		def start_recording_route():
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

			logger.debug("start_recording_route() returned")
			return "start recording"

		@service.route("/stop", methods=["GET"])
		def stop_recording_route():
			"""
			"""

			logger.debug("stop_recording_route() returned")
			return "stop recording"

		@service.route("/rotate", methods=["GET"])
		def rotate_camera_route():
			"""
			"""

			## Get directional parameters
			direction = flask.request.args.get("direction")
			if direction is None:
				return "no direction specified"

			logger.debug("rotate_camera_route() returned")
			return "rotate left " if direction == "left" else "rotate right"

		@service.route("/cleanup", methods=["GET"])
		def shutdown_system_route():
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

			logger.debug("shutdown_system_route() returned")
			return "system shutdown"

		@service.errorhandler(404)
		def error_route(err):
			"""
			"""

			payload = {
				"success": False,
				"message": "404 not found"
			}

			logger.debug("error_route() return payload: " + str(payload))
			return flask.jsonify(payload);

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

	@staticmethod
	def has_connection(url, ping_data):
		"""Performs a test connection to server.

		Key arguments:
		url - url of server

		Returns:
		connected - boolean of connection
		"""

		status = 404
		connected = False

		## Attempt to make connection with server
		try:
			status = requests.head(url=url, params=ping_data).status_code
			connected = True
		except:
			connected = False

		## Check if connection was made
		if status != 200:
			if status == 403:
				logger.error("device not registered: " + str(status))
			else:
				logger.error("no connection to server: " + str(status))

		logger.debug("has_connection() returned " + str(connected))
		return connected