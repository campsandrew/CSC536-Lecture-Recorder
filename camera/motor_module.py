import module

import logging
import time

# Try to import RPi.GPIO module
try:
    import RPi.GPIO as gpio
except:
    gpio = None


# Motor Module Specific Constants

#-------------------
# Motor Module Class
#-------------------
class Motor(module.Module):

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
        self.control_pins = [7, 11, 13, 15]

        # Initialize GPIO pins
        if gpio is not None:
            gpio.setmode(gpio.BOARD)
            for pin in self.control_pins:
                gpio.setup(pin, gpio.OUT)
                gpio.output(pin, 0)

        # EXAMPLE MESSAGES
        # msg = {module.LOCATION: module.INPUT_MODULE,
        # 			 module.DATA: "from motor"}
        # self._send_message(msg, from_module=self)

        # msg = {module.LOCATION: module.CAMERA_MODULE,
        # 			 module.DATA: "from motor"}
        # self._send_message(msg, from_module=self)

        # msg = {module.LOCATION: module.MOTOR_MODULE,
        # 			 module.DATA: "from motor"}
        # self._send_message(msg, from_module=self)

        self.logger.debug("initialize() returned")
        return None

    def rotate(self, right, speed=None):
        """
        """

        # Do nothing if no GPIO pins
        if gpio is None:
            return None

        # Rotation mode
        pins = self.control_pins.copy()
        halfstep_seq = [
            [1, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 1],
            [1, 0, 0, 1]
        ]

        # Set direction of motor
        if right:
            pins.reverse()

        # Turn motor
        for i in range(25):
            for halfstep in range(8):
                for pin in range(4):
                    gpio.output(
                        pins[pin], halfstep_seq[halfstep][pin])
                time.sleep(0.001)

        return None

    def cleanup(self):
        """

        Returns: None
        """

        # GPIO cleanup
        if gpio is not None:
            gpio.cleanup()

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
        if "direction" in data:
            direction = data["direction"].lower()
            right = True if direction == "right" else False
            self.rotate(right)

        self.logger.debug("message data - " + str(data))
        self.logger.debug("controller_message() returned")
        return None
