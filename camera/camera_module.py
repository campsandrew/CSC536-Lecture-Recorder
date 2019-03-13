import module

import logging
import cv2

# Camera Module Specific Constants
SAVE_FILE = "save_file"

#--------------------
# Camera Module Class
#--------------------


class Camera(module.Module):

    def __init__(self):
        """
        """

        # Public
        self.logger = logging.getLogger(__name__)

        # Private
        self._send_message = None
        self._config = None

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

        self._send_message = callback
        self._config = config
        self._filepath = ""

        # EXAMPLE MESSAGES
        # msg = {module.LOCATION: module.INPUT_MODULE,
        # 			 module.DATA: "from camera"}
        # self._send_message(msg, from_module=self)

        # msg = {module.LOCATION: module.MOTOR_MODULE,
        # 			 module.DATA: "from camera"}
        # self._send_message(msg, from_module=self)

        # msg = {module.LOCATION: module.CAMERA_MODULE,
        # 			 module.DATA: "from camera"}
        # self._send_message(msg, from_module=self)

        self.logger.debug("initialize() returned")
        return None

    def start_recording(self):
        name = "image.jpg"
        self._filepath = self._config[SAVE_FILE] + name
        capture = cv2.VideoCapture(0)

        is_read, frame = capture.read()
        cv2.imwrite(self._filepath, frame)
        capture.release()

        # while(True):
        #     ret, frame = capture.read()
        #     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        #     cv2.imshow("frame", gray)
        #     if cv2.waitKey(1) & 0xFF == ord("q"):
        #         break

    def stop_recording(self):
        msg = {module.LOCATION: module.INPUT_MODULE,
               module.DATA: {"upload": self._filepath}}
        self._send_message(msg, from_module=self)

    def cleanup(self):
        """

        Returns: None
        """

        self.logger.debug("cleanup() returned")
        return None

    def controller_message(self, message):
        """

        Key arguments:
        message - message data received from controller

        Returns: None
        """

        if module.ERROR in message:
            self.logger.error("error sending message")
            return None

        if module.SUCCESS in message:
            self.logger.debug("message received - " + str(message))
            return None

        if module.DATA not in message:
            self.logger.warning("message received with no data")
            return None

        # TODO: Create message types switchboard
        data = message[module.DATA]

        # TODO: Put this on a thread
        if "recording" in data:
            action = data["recording"].lower()
            if action == "start":
                self.start_recording()
            else:
                self.stop_recording()

        self.logger.debug("message data - " + str(data))
        self.logger.debug("controller_message() returned")
        return None
