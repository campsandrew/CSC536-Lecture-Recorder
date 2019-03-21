const express = require("express");
const axios = require("axios");
const fs = require("fs");
const { Device, Video, Lecturer, Viewer } = require("./models");
const { getDevice, authUser } = require("./middleware");

const router = express.Router();

// API Routes Device
router.get("/:deviceid/ping", getDevice, devicePingRoute);
router.post("/:deviceid/upload", getDevice, deviceUploadRoute);

// API Frontend Routes - Users
router.post("/user", userRoute);
//router.post("/user/login");

// API Frontend Routes - Devices
//router.put("/device");
router.get("/devices", getDevicesRoute);
router.get("/:deviceid/status", getDevice, deviceStatusRoute);
router.get("/:deviceid/record", getDevice, deviceRecordRoute);
router.get("/:deviceid/rotate", getDevice, deviceRotateRoute); // This can eventually be removed
router.get("/:deviceid/cleanup", deviceCleanupRoute);

// API Frontend Routes - Videos
//router.post("/video");
router.get("/videos", getVideosRoute);

/**
 *
 */
function userRoute(req, res) {
  let required = ["email", "password", "firstName", "lastName", "isLecturer"];
  let payload = {
    success: true
  };

  // Check for proper values in body
  for (let key of required) {
    if (key in req.body && key !== "userType") {
      continue;
    } else if (
      key === "userType" &&
      key in req.body &&
      req.body[key] === "viewer"
    ) {
      if ("lecturerEmail" in req.body) {
        continue;
      }
    }

    payload.success = false;
    payload.message = "not enough fields in body";
    return res.json(payload);
  }

  res.json(payload);
}

/**
 *
 */
function devicePingRoute(req, res) {
  let address = req.query.address;
  let device = req.device;
  let payload = {
    success: true
  };

  // Update device address if different
  if (device.address !== address) {
    device
      .updateOne({ address: address })
      .then(doc => res.json(payload))
      .catch(err => console.log(err.errmsg));
    return;
  }

  res.json(payload);
}

/**
 *
 */
function deviceUploadRoute(req, res) {
  let payload = {
    success: true
  };

  if (!req.files) {
    payload.success = false;
    payload.message = "no files found to upload";
    return res.json(payload);
  }

  // Check if any media was sent
  let media = req.files.media;
  if (!media) {
    payload.success = false;
    return res.json(payload);
  }

  let bitmap = Buffer.from(media.data, "base64");
  let filepath = "videos/" + req.files.media.name;
  fs.writeFileSync(filepath, bitmap);

  res.json(payload);
}

/**
 * TODO: Add query for getting user devices
 */
function getDevicesRoute(req, res) {
  let payload = {
    success: true
  };

  Device.find({})
    .then(function(docs) {
      payload.devices = [];
      for (let doc of docs) {
        device = {
          id: doc.id,
          name: doc.name
        };
        payload.devices.push(device);
      }

      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = err.errmsg;
      res.json(payload);
    });
}

/**
 *
 */
function getVideosRoute(req, res) {
  let payload = {
    success: true
  };

  Video.find({})
    .then(function(docs) {
      payload.videos = [];
      for (let doc of docs) {
        video = {};
        payload.videos.push(video);
      }

      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = err.errmsg;
      res.json(payload);
    });
}

/**
 *
 */
function deviceStatusRoute(req, res) {
  let device = req.device;
  let payload = {
    success: true
  };

  // Send device status request
  axios
    .get(`${device.address}/status`)
    .then(function(response) {
      if (response.data.success) {
        delete response.data.success;
        for (let k in response.data) {
          payload[k] = response.data[k];
        }
      } else {
        payload.success = false;
        payload.message = response.data.message;
      }

      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = "no communication with device";
      res.json(payload);
    });
}

/**
 *
 */
function deviceRecordRoute(req, res) {
  let action = req.query.action.toLowerCase();
  let device = req.device;
  let payload = {
    success: true
  };

  // Check for valid query action
  if (action !== "start" && action !== "stop") {
    payload.success = false;
    payload.message = "invalid recording action";
    return res.json(payload);
  }

  // Send device status request
  axios
    .get(`${device.address}/${action}`)
    .then(function(response) {
      if (response.data.success) {
        delete response.data.success;
        for (let k in response.data) {
          payload[k] = response.data[k];
        }
      } else {
        payload.success = false;
        payload.message = response.data.message;
      }

      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = "no communication with device";
      res.json(payload);
    });
}

/**
 *
 */
function deviceRotateRoute(req, res) {
  let direction = req.query.direction.toLowerCase();
  let device = req.device;
  let payload = {
    success: true
  };

  // Check for valid query action
  if (direction !== "left" && direction !== "right") {
    payload.success = false;
    payload.message = "invalid rotation direction";
    return res.json(payload);
  }

  // Send device status request
  axios
    .get(`${device.address}/rotate?direction=${direction}`)
    .then(function(response) {
      if (response.data.success) {
        delete response.data.success;
        for (let k in response.data) {
          payload[k] = response.data[k];
        }
      } else {
        payload.success = false;
        payload.message = response.data.message;
      }

      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = "no communication with device";
      res.json(payload);
    });
}

/**
 *
 */
function deviceCleanupRoute(req, res) {
  let payload = {
    success: true
  };

  res.json(payload);
}

module.exports = router;
