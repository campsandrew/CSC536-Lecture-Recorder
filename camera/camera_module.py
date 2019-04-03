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
        self._cap = VideoCaptureAsync(
            0, model=self._config[MODEL_FILE], proto=self._config[PROTO_FILE])
        self._cap.start()

        self.logger.debug("initialize() returned")
        return None

    def start_recording(self, filename):

        return True

    def get_frame(self):
        frame = self._cap.read()
        data = cv2.imencode(".jpg", frame)[1].tobytes()

        return data

    def stop_recording(self):
                #self._filepath = self._cap.stop()
        # sg = {module.LOCATION: module.INPUT_MODULE,
        #       module.DATA: {"upload": self._filepath}}
        #self._send_message(msg, from_module=self)
        print("STOP RECORDING")
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

    def __init__(self, src=0, model=None, proto=None, fps=30):
        """
        """

        # Public
        self.logger = logging.getLogger(__name__)

        # Private
        self._started = False
        self._cap = VideoStream(src).start()
        self._ct = centroidtracker.CentroidTracker()
        self._read_lock = threading.Lock()
        self._thread = threading.Thread(target=self._update, args=())
        self._net = None

        frame = self._cap.read()
        self._frame = imutils.resize(frame, width=300)
        (self._H, self._W) = self._frame.shape[:2]

        # Initialize neural net
        if model is not None or proto is not None:
            self._net = cv2.dnn.readNetFromCaffe(proto, model)

        # self._filepath = filepath + \
        #    str(datetime.datetime.now()).replace(
        #        ":", "-").replace(" ", ".") + ".m4v"
        # self._out = cv2.VideoWriter(
        #    self._filepath, self._fourcc, fps, self._frame_size)
        #self._fourcc = cv2.VideoWriter_fourcc("m", "p", "4", "v")

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

        return frame

    def _update(self):
        """
        """
        #fps = FPS().start()

        while self._started:
            frame = self._cap.read()
            frame = imutils.resize(frame, width=300)
            frame = cv2.flip(frame, 1)

            blob = cv2.dnn.blobFromImage(
                frame, 1.0, (self._W, self._H), (104.0, 177.0, 123.0))
            self._net.setInput(blob)
            detections = self._net.forward()
            rects = []
            # fps.update()

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
                # draw both the ID of the object and the centroid of the
                # object on the output frame
                text = "ID {}".format(objectID)
                cv2.putText(frame, text, (centroid[0] - 10, centroid[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.circle(frame, (centroid[0], centroid[
                           1]), 4, (0, 255, 0), -1)

            # self._out.write(frame)
            with self._read_lock:
                self._frame = frame

        # fps.stop()
        #print("[INFO] elasped time: {:.2f}".format(fps.elapsed()))
        #print("[INFO] approx. FPS: {:.2f}".format(fps.fps()))

        return None

    def stop(self):
        """
        """

        self._started = False
        self._thread.join()
        self._cap.stop()
        # self._out.release()

        return


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
