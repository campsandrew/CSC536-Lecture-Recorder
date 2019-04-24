from camera_module import Camera
from motor_module import Motor
from input_module import Input

import logging
import json
import uuid
import sys
import os

# Constants
# Note: These module names could be python
# Enums eventually
CONTROLLER = "controller"
MOTOR_MODULE = "motor"
CAMERA_MODULE = "camera"
INPUT_MODULE = "input"
CONFIG_FILE = "config.json"
DEBUG = "debug"
LOCATION = "location"
ERROR = "error"
SUCCESS = "success"

# Statuses
ONLINE = 0
RECORDING = 1

#----------------------
# Main Controller Class
#----------------------


class Controller:

    def __new__(cls, filepath=CONFIG_FILE):
        """Creates instance of class and initializes
        logger.

        Returns: self - instance of class
        """

        cls._config = cls.get_configuration(filepath)
        cls._debug = cls._config[CONTROLLER][DEBUG]
        cls.logger = logging.getLogger()

        # Initialize logger
        logging.basicConfig()
        if cls._debug:
            cls.logger.setLevel(logging.DEBUG)

        instance = super(Controller, cls).__new__(cls)
        return instance

    def __init__(self, filepath=CONFIG_FILE):
        """Initializes class attributes.

        Keyword arguments:
        filepath - JSON file with system configurations
        """

        # Public
        self.deviceId = str(uuid.getnode())
        self.status = ONLINE

        # Private
        self._modules = {}
        self._registered_modules = {
            MOTOR_MODULE: Motor,
            CAMERA_MODULE: Camera,
            INPUT_MODULE: Input
        }

        # Initialize all registered modules
        for name, module in self._registered_modules.items():
            self._modules[name] = module()

        # Startup flask input service
        input_config = self._config[INPUT_MODULE]
        input_config[DEBUG] = self._debug
        self._modules[INPUT_MODULE].start_service(self, input_config)

        self.logger.debug("__init__() returned")
        return None

    def initialize(self):
        """Calls initialize method on all registered
        modules. Each module will get passed a message 
        callback method and individual configuration
        read from JSON file. Controller debug config is
        passed through to all module configs.

        Returns: None
        """

        # Call init methods on all modules
        for name, module in self._modules.items():
            config = self._config[name]
            config[DEBUG] = self._debug
            module.initialize(self.module_message, config)

        self.logger.debug("initialize() returned")
        return None

    def module_message(self, message, from_module=None):
        """Receive message from module and send message
        to specific module controller method. If module is
        sending a message that is unknown, a callback is
        not made.

        Keyword arguments:
        message - any data passed to module controller method
        that must have LOCATION
        from_module - current instance of module sending message

        Returns:
        Boolean - true if message was sent correctly
        """

        directed = False
        sender_callback = None
        return_message = {}

        # Register sender callback
        for name, module in self._registered_modules.items():
            if isinstance(from_module, module):
                sender_callback = self._modules[name].controller_message
                self.logger.debug(name + " message directed")
                break

        # Send message to receiver
        if LOCATION in message and message[LOCATION] in self._registered_modules:
            loc = message[LOCATION]
            return_message[SUCCESS] = "message sent to " + loc
            self.logger.debug("message sent to " + loc)
            directed = self._modules[loc].controller_message(message)
        else:
            return_message[ERROR] = "no message location"
            self.logger.error("no message location from: " + str(from_module))

        # Send message to sender
        if sender_callback is not None:
            sender_callback(return_message)

        self.logger.debug("module_message() returned " + str(directed))
        return directed

    def cleanup(self, shutdown=False):
        """Calls cleanup method on all registered modules.

        Keyword arguments:
        shutdown - boolean to trigger system shutdown

        Returns: None
        """

        # Call cleanup methods on all modules
        for name, module in self._modules.items():
            module.cleanup()

        # Turn off computer (untested on raspberry pi, needs su permissions)
        if shutdown:
            self.logger.warning("system shutting down")
            os.system("shutdown now")

        self.logger.debug("cleanup() returned")
        return None

    @staticmethod
    def get_configuration(filepath):
        """Static method to read a JSON config file
        with module specific configurations passed to
        each module when an instance is created. If config
        file fails to open and the program exits with exit code -1

        Keyword arguments:
        filepath - JSON configuration filepath

        Return:
        config - dictionary with the config for each module
        """

        # Attempt to read config file
        try:
            file = open(filepath, "r")
            config = json.load(file)
            file.close()
        except:
            logging.error("Could not open " + filepath)
            logging.info("Exiting with status code -1")
            sys.exit(-1)

        # Get environment config
        env = "development"
        if "FLASK_ENV" in os.environ:
            env = os.environ["FLASK_ENV"]

        return config[env]
