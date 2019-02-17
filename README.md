## Video Lecture Tracker                  
### Team: Andrew Camps, David Weinflash, Himanshu Jain, Kyle Willson

### Summary
Using a microcontroller, camera and motor, a rotating camera system will be created that will track a lecturer automatically. The product will provide an expandable, object tracking platform capable of rotating itself so that it can always keep the tracked object in its field of view (FOV). The system will have an easy to use interface for starting and stopping lectures and web uploading capabilities to review recorded lectures. Since support and use of microcontrollers are so widespread, the possibilities of additional features and sensors are virtually limitless, further pushing the bounds of innovation.

### Customer Value
The primary customer for this project is the common presenter who would benefit from recording his or her presentations. Specifically, the Video Lecture Tracker is designed with the modern professor in mind, where the professor often records his/her lectures to later distribute online to students or staff. By automatically recording lectures and adjusting to movement, the Video Lecture Tracker will provide any professor with a professional recording of his/her presentation.

### Problem Definition
Many professors and lectures tend to move around the classroom when teaching. Because of limited camera view angles many online records are confusing and hard to follow and whiteboard writing is missed. We would like to address this issue by creating an automatic recording devices which will track the location of the lecturer as they move around the room, interacting with students or drawing on the whiteboard.
 
### Proposed Benefit
In constructing an automatic presentation recorder, we have chosen to provide college professor’s with an easy and hassle-free way to consistently record and save professional presentations for easy distribution. Our product will allow presenters to record their lectures more conveniently and more efficiently.
It is common knowledge that body language makes up the majority of all human interaction and communication.  With this system, we can capture this thanks to its tracking and rotation abilities, which will in turn enhance the cyber education experience.

### Technology
The system will be primarily composed of three pieces of hardware; a Microcontroller like a Raspberry Pi/Arduino, a camera to track an object, and a servo motor to rotate the camera to keep an object within the FOV.  The main driver of the system will be OpenCV, or the an industry standard tool for object recognition on computers.

### Proposed System
The main components of our system and their functionality:
Camera - Capture the recording.
Servo motor - Rotate the camera on a single axis.
Microcontroller - Provide signal to the servo motor.
Mobile app/Website - Web interface for the user to manual control the system.
Potential additional product features:
Sensors - Track multiple targets

### Testing
**Consumer Testing** - A typical test will involve a lecturer being able to start up the system from a web application at the beginning of a lecture and stop the recording at the end of a lecture. We will measure the effectiveness of this testing based on a survey given to the lecturer after using the system. The survey will consist of questions about ease of use and questions gauging how well the system recorded the lecture. Two candidates for consumer testing will be Alon Efrat and Lester Mccann, both professors in the computer science department that frequently make lecture recordings.

**Passing test cases:**
* Lecturer is able to start the recording and recognize the device is recording.
* Lecturer can stop the recording and recognize the device is done recording.
* View and replay uploaded recordings on the web application.
* The camera has followed the professor throughout the entire duration of the lecture.

**Code Testing** - Code testing will involve regression and functional tests of each of the projects subsystems. We will measure the effectiveness of these tests based on if all of the features throughout the process of the project pass all regression and functional tests. 

**The following subsystems will be subject to testing:**
**Web** - The user interface where a lecture will begin, end and display recordings
* Regression Tests
* Functional Tests

**Camera System** - Raspberry Pi, servo motor, camera
* Regression Tests
* Functional Tests

### Tools and External Technology
* Tools
* Python or C/C++
* Java
* Javascript, CSS, HTML
* Basic hand tools to create camera mounting system (wrenches, screwdrivers, wires, etc)
* Classroom with wifi for testing

### External Technologies
* Amazon AWS (free trial) - hosting the website to upload the recording
* openCV - computer vision library
* Python flask - micro web framework
* Reactjs - web frontend library
* Git/Github - version control software

### Schedule - Iterations (date)Tasks
* **1 (2/11/2019):**
Rotating camera mounted to a Raspberry Pi with single degree of freedom
Create code deployment mechanisms for version control, regression and functional testing
Create account for AWS and start “hello world” website with front and backend

* **2 (2/20/2019):**
Recognize a human using openCV and display on a screen (camera system)
Create a base page for a user to start, stop and view uploaded recordings (frontend)
Allow storage and retrieval of video files from website backend (backend)

* **3 (3/13/2019):**
Rotate camera as human is moving out field of view on left and right sides of frame (camera system)
Create basic login and account creation page (frontend)
Create user storage in database for account creation and authentication for login (backend)

* **4 (4/20/2019):**
Create search mechanism for initially finding a person to record or if person is lost during recording (camera system)
Retrieve and allow playback of recorded videos on the user dashboard page (frontend)
Create backend communication mechanism with camera system and AWS server (backend)

* **5 (4/1/2019):**
Start and stop a recording tracking a human to be saved on the Raspberry Pi’s storage (camera system)
Allow automatic video transfer from camera system to server after recording has stopped (backend)
