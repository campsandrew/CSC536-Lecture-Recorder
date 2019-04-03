import module

import requests
import logging
import socket
import flask
import sys
import os

# Input Module Specific Constants
CONNECTOR = "connector"
HOST = "host"
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
        global deviceId
        global input_config

        # Initialize flask service and logger
        input_config = config
        service = flask.Flask(__name__)
        logger = logging.getLogger(__name__)
        kwargs = {"host": config[HOST],
                  "port": config[PORT],
                  "debug": config[module.DEBUG],
                  "use_reloader": False}

        # Don't start service if not connected
        # to server
        deviceId = controller.deviceId
        server = Input.server_address_lookup(config[CONNECTOR])
        parts = [server, "device", deviceId, "ping"]
        status_url = "/".join(s.strip("/") for s in parts)
        params = {"address": "http://" + Input.get_ip_address() +
                  ":" + str(config[PORT])}
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
            return flask.jsonify(payload)

        @service.route("/live", methods=["GET"])
        def live_stream_route():
            """
            """

            payload = {
                "success": True,
            }

            # Check if device is alreaady recording
            msg = {module.LOCATION: module.CAMERA_MODULE,
                   module.DATA: {"frame": True}}
            frame = controller.module_message(msg, from_module=Input())

            logger.debug("live_stream_route() return payload: " + str(payload))
            return flask.Response(b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n\r\n", mimetype="multipart/x-mixed-replace; boundary=frame")

        @service.route("/start", methods=["GET"])
        def start_recording_route():
            """
            """

            payload = {
                "success": True,
                "recording": True,
            }

            # Check if device is alreaady recording
            if controller.status == 1:
                payload["success"] = False
                payload["message"] = "device currently recording"
                payload["status"] = 1
            else:
                msg = {module.LOCATION: module.CAMERA_MODULE,
                       module.DATA: {"record": True}}
                success = controller.module_message(msg, from_module=Input())
                controller.status = 1
                payload["status"] = 1

            logger.debug("start_recording_route() returned: " + str(payload))
            return flask.jsonify(payload)

        @service.route("/stop", methods=["GET"])
        def stop_recording_route():
            """
            """

            payload = {
                "success": True,
                "recording": False
            }

            # Check if device is alreaady not recording
            if controller.status == 0:
                payload["success"] = False
                payload["message"] = "device not recording"
            else:
                msg = {module.LOCATION: module.CAMERA_MODULE,
                       module.DATA: {"record": False}}
                success = controller.module_message(msg, from_module=Input())
                controller.status = 0

            logger.debug("stop_recording_route() returned: " + str(payload))
            return flask.jsonify(payload)

        @service.route("/rotate", methods=["GET"])
        def rotate_camera_route():
            """
            """

            payload = {
                "success": True
            }

            # Get directional parameters
            direction = flask.request.args.get("direction")
            if direction is None:
                payload["success"] = False
                payload["message"] = "no direction specified"
            else:
                msg = {module.LOCATION: module.MOTOR_MODULE,
                       module.DATA: {"direction": direction}}
                success = controller.module_message(msg, from_module=Input())

            logger.debug("rotate_camera_route() returned: " + str(payload))
            return flask.jsonify(payload)

        @service.route("/cleanup", methods=["GET"])
        def shutdown_system_route():
            """
            """

            # Get shutdown parameter
            shutdown = flask.request.args.get("shutdown")
            if shutdown is None:
                shutdown = False

            # Attempt to cleanup system
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
            """Route used if request is made
            to an unregistered route in Flask.

            Key arguments:
            err - 404 error created by Flask

            Response payload:
            success - False
            message - error message from err argument
            """

            payload = {
                "success": False,
                "message": str(err)
            }

            logger.debug("error_route() return payload: " + str(payload))
            return flask.jsonify(payload)

        # initialize modules in controller
        controller.initialize()

        # Starting service
        service.run(**kwargs)
        return service

    @staticmethod
    def cleanup():
        """Static method to shutdown flask service.

        Raise: RuntimeError - invalid server running

        Returns: None
        """

        # Gets flask shutdown mehtod
        shutdown = flask.request.environ.get("werkzeug.server.shutdown")
        if shutdown is None:
            raise RuntimeError("must run with Werkzeug Server")

        # Turns off flask service
        shutdown()

        logger.debug("cleanup() returned")
        return None

    @staticmethod
    def uploadVideo(url, filepath):
        """
        """

        data = {}

        # Try to make connection with the server
        try:
            files = {"media": open(filepath, "rb")}
            data = requests.post(url, files=files).json()
        except FileNotFoundError:
            logger.error("error opening file - " + filepath)
        except:
            logger.error("no connection to connector server - " + url)

        # TODO: delete file
        if "success" in data:
            os.remove(filepath)
            logger.debug("file deleted - " + filepath)

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

        # TODO: Create message types switchboard
        data = message[module.DATA]

        # TODO: Put this on a thread
        if "upload" in data:
            server = Input.server_address_lookup(input_config[CONNECTOR])
            parts = [server, deviceId, "upload"]
            url = "/".join(s.strip("/") for s in parts)
            # print(data["upload"])
            #Input.uploadVideo(url, data["upload"])

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

        # Attempt to make connection with server
        try:
            status = requests.head(url=url, params=ping_data).status_code
            if status == 200:
                connected = True
        except:
            connected = False

        # Check if connection was made
        if status != 200:
            if status == 403:
                logger.error("device not registered: " + str(status))
            else:
                logger.error("no connection to server: " + str(status))

        logger.debug("has_connection() returned " + str(connected))
        return connected

    @staticmethod
    def server_address_lookup(url):
        """Gets the address of a server using
        a connector server lookup

        Key arguments:
        url - url of the server to make connection

        Returns:
        address - url address of the server
        """

        data = {}
        address = ""

        # Try to make connection with the server
        try:
            data = requests.get(url).json()
        except:
            logger.error("no connection to connector server - " + url)

        # Get address from data
        if "success" in data and "address" in data:
            address = data["address"]

        logger.debug("server_address_lookup() returned " + address)
        return address

    @staticmethod
    def get_ip_address():
        """
        """

        ip_address = ""
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        s.close()

        return ip_address
