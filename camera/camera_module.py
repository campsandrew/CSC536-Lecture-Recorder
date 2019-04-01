import module

import threading
import datetime
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
        self._cap = VideoCaptureAsync(0, self._config[SAVE_FILE])
        self._cap.start()

        self.logger.debug("initialize() returned")
        return None

    def start_recording(self):
         #self._filepath = self._cap.stop()
        # sg = {module.LOCATION: module.INPUT_MODULE,
        #       module.DATA: {"upload": self._filepath}}
        #self._send_message(msg, from_module=self)
        return True

    def get_frame(self):
        grabbed, frame = self._cap.read()
        data = cv2.imencode(".jpg", frame)[1].tobytes()

        return data

    def stop_recording(self):
        return True

    def cleanup(self):
        """

        Returns: None
        """

        # Kills camera thread
        self._cap.stop()

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
        if "record" in data:
            if data["record"]:
                return self.start_recording()

            return self.stop_recording()

        if "frame" in data:
            return self.get_frame()

        self.logger.debug("message data - " + str(data))
        self.logger.debug("controller_message() returned")
        return None


#--------------------------
# Async Video Capture Class
#--------------------------
class VideoCaptureAsync:

    def __init__(self, src=0, filepath="video/", fps=30):
        """
        """

        # Public
        self.logger = logging.getLogger(__name__)

        # Private
        self._started = False
        self._cap = cv2.VideoCapture(src)
        self._grabbed, self._frame = self._cap.read()
        #self._fourcc = cv2.VideoWriter_fourcc("m", "p", "4", "v")
        self._frame_size = (int(self._cap.get(3)), int(self._cap.get(4)))
        # self._filepath = filepath + \
        #    str(datetime.datetime.now()).replace(
        #        ":", "-").replace(" ", ".") + ".m4v"
        # self._out = cv2.VideoWriter(
        #    self._filepath, self._fourcc, fps, self._frame_size)
        self._read_lock = threading.Lock()
        self._thread = threading.Thread(target=self._update, args=())

        return None

    def start(self):
        """
        """

        if self._started:
            print('[!] Asynchroneous video capturing has already been started.')
            return None

        self._started = True
        self._thread.start()

        return self

    def read(self):
        with self._read_lock:
            frame = self._frame.copy()
            grabbed = self._grabbed

        return grabbed, frame

    def _update(self):
        """
        """

        while self._started:
            grabbed, frame = self._cap.read()
            frame = cv2.flip(frame, 1)
            # self._out.write(frame)
            with self._read_lock:
                self._grabbed = grabbed
                self._frame = frame

        return None

    def stop(self):
        """
        """

        self._started = False
        self._thread.join()
        self._cap.release()
        # self._out.release()

        return

    def __exit__(self, exec_type, exc_value, traceback):
        self._cap.release()
