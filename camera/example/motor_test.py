PINS = [7, 11, 13, 15]
STEPS_PER_REV = 2048
MAX_ANGLE = 50


#-------------------
# Motor Module Class
#-------------------
class Motor:

    def __init__(self):

        # Try to import RPi.GPIO module
        try:
            import RPi.GPIO as gpio
            self.gpio = gpio
        except:
            self.gpio = None

        # Private
        self._pins = PINS
        self._steps_per_rev = STEPS_PER_REV
        self._steps_per_deg = self._steps_per_rev / 360
        print(self._steps_per_deg)
        self._angle = 0

        # Initialize GPIO pins
        if self.gpio is not None:
            self.gpio.setwarnings(False)
            self.gpio.setmode(self.gpio.BOARD)
            for pin in self._pins:
                self.gpio.setup(pin, self.gpio.OUT)
                self.gpio.output(pin, self.gpio.LOW)

        return None

    def cleanup(self):

        # GPIO cleanup
        if self.gpio is not None:
            self.gpio.cleanup()

        return None

    def _movement_calc(self, current, prev):
        degrees = 0
        rpm = 20
        curr_box, curr_ct = current
        prev_box, prev_ct = prev

        # Calculate direction and rotation duration
        (cSX, cSY, cEX, cEY) = curr_box
        (pSX, pSY, pEX, pEY) = prev_box

        if len(prev_ct) != 0 and len(curr_ct) != 0:
            currX, currY = curr_ct[next(iter(curr_ct))]
            prevX, prevY = prev_ct[next(iter(prev_ct))]
            mag = abs(currX - prevX)
            diff = currX - prevX

            print("PIX DIFF: " + str(mag))

            if mag > 2 and diff > 2:
                degrees = diff / 2
                # print("CLOCKWISE")
            elif mag > 2 and diff < 2:
                degrees = diff / 2
                # print("COUNTERCLOCKWISE")
            else:
                return None, None

        return degrees, rpm

    def _rotate(self, degrees=None, rpm=20):
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
                step += 1
                self._angle += (direction * self._steps_per_deg)
                time.sleep(wait_time)
                print(self._angle)

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

if __name__ == "__main__":
    motor = Motor()
    motor._rotate(5)
