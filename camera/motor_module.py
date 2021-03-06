import module

import logging
import time
import math


# Motor Module Specific Constants
PINS = "pins"
STEPS_PER_REV = "steps_per_rev"


#-------------------
# Motor Module Class
#-------------------
class Motor(module.Module):

    def __init__(self):
        """
        """

        # Public
        self.logger = logging.getLogger(__name__)

        # Try to import RPi.GPIO module
        try:
            import RPi.GPIO as gpio
            self.gpio = gpio
        except:
            self.gpio = None

        # Private
        self._send_message = None
        self._config = None
        self._pins = None
        self._steps_per_rev = None
        self._deg_per_step = None
        self._angle = 0

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
        self._pins = config[PINS]
        self._steps_per_rev = config[STEPS_PER_REV]
        self._deg_per_step = 360 / self._steps_per_rev

        # Initialize GPIO pins
        if self.gpio is not None:
            self.gpio.setwarnings(False)
            self.gpio.setmode(self.gpio.BOARD)
            for pin in self._pins:
                self.gpio.setup(pin, self.gpio.OUT)
                self.gpio.output(pin, self.gpio.LOW)

        self.logger.debug("initialize() returned")
        return None

    def cleanup(self):
        """

        Returns: None
        """

        direction = 1
        if self._angle < 0:
            direction = -1

        # Put camera back to original location
        while direction * self._angle > 0:
            self._rotate(-1 * direction * 1, cleanup=True)

        # GPIO cleanup
        if self.gpio is not None:
            self.gpio.cleanup()

        self.logger.debug("cleanup() returned")
        return None

    def _movement_calc(self, ct, size):
        w, h = size
        degrees = 0
        rpm = 20

        midX = w / 2

        if len(ct) != 0:
            currX, currY = ct[next(iter(ct))]
            diff = midX - currX

            if diff > 0:
                degrees = -diff
            elif diff < 0:
                degrees = diff
            else:
                pass

        return degrees, rpm

    def _rotate(self, degrees=None, rpm=20, cleanup=False):
        """
        """

        # Do nothing if no GPIO pins
        if self.gpio is None or degrees is None or rpm is None:
            return None

        # Calculate time between steps in seconds
        step = 0
        wait_time = 60 / (self._steps_per_rev * rpm)
        steps = math.fabs(degrees * self._steps_per_rev / 360)

        # Determine direction of movement
        direction = 1
        if degrees < 0:
            self._pins.reverse()
            direction = -1

        while step < steps:
            for pin_index in range(len(self._pins)):
                self._fullstep(self._pins, pin_index)
                time.sleep(wait_time)
                step += 1
                self._angle += (direction * self._deg_per_step)

        if degrees < 0:
            self._pins.reverse()

        # Set all pins to low
        for pin in self._pins:
            self.gpio.output(pin, self.gpio.LOW)

        return None

    def _fullstep(self, pins, pin_index):
        """
        """

        self.gpio.output(pins[pin_index], self.gpio.HIGH)
        self.gpio.output(pins[(pin_index + 3) % 4], self.gpio.HIGH)
        self.gpio.output(pins[(pin_index + 1) % 4], self.gpio.LOW)
        self.gpio.output(pins[(pin_index + 2) % 4], self.gpio.LOW)

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

        # Message type switchboard
        data = message[module.DATA]
        if "size" in data and "current" in data:
            args = self._movement_calc(data["current"], data["size"])
            self._rotate(*args)
            return None

        self.logger.debug("message data - " + str(data))
        self.logger.debug("controller_message() returned")
        return None
