import centroidtracker
import module

from imutils.video import VideoStream
import threading
import datetime
import logging
import imutils
import numpy
import cv2

# Camera Module Specific Constants
SAVE_FOLDER = "save_folder"
MODEL_FILE = "model_file"
PROTO_FILE = "proto_file"
FRAME_WIDTH = "frame_width"
CAMERA_SOURCE = "camera_source"


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
        self._net = None
        self._out = None
        self._H = None
        self._W = None
        self._size = None
        self._cap = None
        self._processed_frame = None
        self._frame = None
        self._filepath = ""
        self._started = False
        self._recording = False
        self._ct = centroidtracker.CentroidTracker()
        self._frame_lock = threading.Lock()
        self._process_lock = threading.Lock()
        self._record_lock = threading.Lock()
        self._capture_thread = threading.Thread(
            target=self._read_frame, args=())
        self._process_thread = threading.Thread(
            target=self._process_frame, args=())

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
        if self._started:
            self.logger.error(
                "initialize() video capture already initialized")
            self.logger.debug("start() returned")
            return None

        # Initializae capture opject and neural net
        self._W = config[FRAME_WIDTH]
        self._cap = VideoStream(config[CAMERA_SOURCE]).start()
        self._net = cv2.dnn.readNetFromCaffe(
            config[PROTO_FILE], config[MODEL_FILE])

        # Let camera warm up and get frame sizes
        frame = None
        while frame is None:
            frame = self._cap.read()
        self._frame = imutils.resize(frame, width=self._W)
        (self._H, _) = self._frame.shape[:2]

        # Start threading for frame processing and capture
        self._started = True
        self._capture_thread.start()
        self._process_thread.start()

        self.logger.debug("initialize() returned")
        return None

    def start_recording(self, filename="", fps=50.0):
        """
        """

        # Verify there is no recording happening
        if self._recording:
            self.logger.error(
                "start_recording() video recording already started")
            self.logger.debug("start_recording() returned")
            return False

        # Create filename
        self._filepath = self._config[SAVE_FOLDER] + filename + ".m4v"
        # self._filepath = self._config[SAVE_FOLDER] + filename + \
        #     str(datetime.datetime.now()).replace(
        #         ":", "-").replace(" ", ".") + ".m4v"

        # Initialize video writer
        fourcc = cv2.VideoWriter_fourcc("M", "P", "4", "V")
        self._out = cv2.VideoWriter(
            self._filepath, fourcc, fps, (self._W, self._H))
        with self._record_lock:
            self._recording = True

        self.logger.debug("start_recording() returned")
        return True

    def stop_recording(self):
        """
        """

        # Verify that recording is happening
        if not self._recording:
            self.logger.error(
                "stop_recording() video recording already stopped")
            self.logger.debug("stop_recording() returned")
            return False

        with self._record_lock:
            self._recording = False
            self._out.release()
        # self._filepath = self._cap.stop()
        # sg = {module.LOCATION: module.INPUT_MODULE,
        #       module.DATA: {"upload": self._filepath}}
        # self._send_message(msg, from_module=self)

        self.logger.debug("stop_recording() returned")
        return True

    def cleanup(self):
        """

        Returns: None
        """

        if not self._started:
            self.logger.error(
                "cleanup() camera already cleaned up")
            self.logger.debug("cleanup() returned")
            return None

        # Kills camera thread
        self._started = False
        self._recording = False
        self._capture_thread.join()
        self._process_thread.join()
        if self._out is not None:
            self._out.release()

        self.logger.debug("cleanup() returned")
        return None

    def get_frame(self):
        """
        """

        with self._process_lock:
            frame = self._processed_frame.copy()

        frame = cv2.flip(frame, 1)
        return cv2.imencode(".jpg", frame)[1].tobytes()

    def _read_frame(self):
        """This threaded method is just
        responsible for reading the camera where
        the frame is stored in shared memeory with
        the other frames to read.
        """

        fps = FPS().start()
        while self._started:
            frame = self._cap.read()
            frame = imutils.resize(frame, width=self._W)

            # Save video file if recording
            if self._recording:
                self._out.write(frame)

            fps.update()
            with self._frame_lock:
                self._frame = frame

        fps.stop()
        self.logger.debug("[INFO] elasped time: {:.2f}".format(fps.elapsed()))
        self.logger.debug("[INFO] approx. FPS: {:.2f}".format(fps.fps()))
        self.logger.debug("_read_frame() returned")
        return self

    def _process_frame(self):
        """This threaded method is responsible
        for doing the classification processing as well
        as communicating with the motor module.
        """

        while self._started:
            with self._frame_lock:
                frame = self._frame.copy()

            blob = cv2.dnn.blobFromImage(
                frame, 1.0, (self._W, self._H), (104.0, 177.0, 123.0))
            self._net.setInput(blob)
            detections = self._net.forward()
            rects = []

            # loop over the detections
            for i in range(0, detections.shape[2]):
                if detections[0, 0, i, 2] > 0.5:  # 50% confidence
                    box = detections[0, 0, i, 3:7] * \
                        numpy.array([self._W, self._H, self._W, self._H])
                    rects.append(box.astype("int"))

                    # Draws bounding box
                    (startX, startY, endX, endY) = box.astype("int")
                    cv2.rectangle(frame, (startX, startY), (endX, endY),
                                  (0, 255, 0), 2)

            # update our centroid tracker using the computed set of bounding
            # box rectangles
            objects = self._ct.update(rects)

            # loop over the tracked objects
            for (objectID, centroid) in objects.items():
                text = "ID {}".format(objectID)
                cv2.putText(frame, text, (centroid[0] - 10, centroid[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.circle(frame, (centroid[0], centroid[
                           1]), 4, (0, 255, 0), -1)
                #print(centroid[0], centroid[1])

            with self._process_lock:
                self._processed_frame = frame

        self.logger.debug("_process_frame() returned")
        return self

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

        # Message switchboard
        data = message[module.DATA]
        if "record" in data:
            if data["record"] and "filename" in data:
                return self.start_recording(data["filename"])

            return self.stop_recording()

        if "frame" in data:
            return self.get_frame()

        self.logger.debug("message data - " + str(data))
        self.logger.debug("controller_message() returned")
        return None


#--------------------------
# Measurement Class for FPS
#--------------------------
class FPS:

    def __init__(self):
        # store the start time, end time, and total number of frames
        # that were examined between the start and end intervals
        self._start = None
        self._end = None
        self._numFrames = 0

    def start(self):
        # start the timer
        self._start = datetime.datetime.now()
        return self

    def stop(self):
        # stop the timer
        self._end = datetime.datetime.now()

    def update(self):
        # increment the total number of frames examined during the
        # start and end intervals
        self._numFrames += 1

    def elapsed(self):
        # return the total number of seconds between the start and
        # end interval
        return (self._end - self._start).total_seconds()

    def fps(self):
        # compute the (approximate) frames per second
        return self._numFrames / self.elapsed()
