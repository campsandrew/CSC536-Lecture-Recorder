const express = require("express");
const axios = require("axios");
const { hasValidFields, canAddDevice } = require("./utils");
const { getDevice, getVideo, authUser } = require("./middleware");
const { Device, Lecturer } = require("./models");

const router = express.Router();

// API Device Routes
router.get("/device/:deviceid/ping", getDevice, devicePingRoute);
router.post(
  "/device/:deviceid/:videoid/upload",
  getDevice,
  getVideo,
  deviceUploadRoute
);

// API Frontend Routes - Devices
router.post("/device", authUser, addDeviceRoute);
router.get("/devices", authUser, getDevicesRoute);
router.delete(
  "/device/:deviceid/delete",
  authUser,
  getDevice,
  deleteDeviceRoute
);
router.get("/device/:deviceid/status", authUser, getDevice, deviceStatusRoute);
router.get("/device/:deviceid/record", authUser, getDevice, deviceRecordRoute);
router.get("/device/:deviceid/cleanup", authUser, deviceCleanupRoute);

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
  const device = req.device;
  const video = req.video;
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
  //fs.writeFileSync(filepath, bitmap);

  res.json(payload);
}

/**
 *
 */
function addDeviceRoute(req, res) {
  const required = ["id", "name"];
  const user = req.user;
  let payload = {
    success: true
  };

  // Check for proper values in body
  if (!hasValidFields(req.body, required)) {
    payload.message = "invalid fields";
    payload.success = false;
    return res.json(payload);
  }

  if (user.__t !== "Lecturer") {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  // Create new device
  let device = new Device({
    id: req.body.id,
    name: req.body.name
  });

  Lecturer.populate(user, { path: "devices" })
    .then(function(lecturer) {
      if (!canAddDevice(lecturer, device)) {
        payload.message = "device already registered";
        throw new Error();
      }

      lecturer.devices.push(device);
      return lecturer.save();
    })
    .then(function(user) {
      if (!user) {
        payload.message = "error registering device with user";
        throw new Error();
      }

      return device.save();
    })
    .then(function(device) {
      if (!device) {
        payload.message = "error registering device";
        throw new Error();
      }

      payload.device = {
        id: device.id,
        name: device.name
      };
      res.json(payload);
    })
    .catch(function(err) {
      if (err.code === 11000) {
        payload.message = "device already registered";
      }

      if (!payload.message) {
        payload.message = "unable to register device";
      }

      payload.success = false;
      return res.json(payload);
    });
}

/**
 *
 */
function getDevicesRoute(req, res) {
  const user = req.user;
  let payload = {
    success: true
  };

  if (user.__t !== "Lecturer") {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  Lecturer.populate(user, "devices")
    .then(function(lecturer) {
      if (!lecturer) {
        payload.message = "unable to get devices";
        throw new Error();
      }

      // Populate devices in response
      payload.devices = [];
      for (let doc of lecturer.devices) {
        let device = {
          id: doc.id,
          name: doc.name
        };
        payload.devices.push(device);
      }

      res.json(payload);
    })
    .catch(function(err) {
      if (!payload.message) {
        payload.message = "unable to get devices";
      }
      payload.success = false;
      res.json(payload);
    });
}

function deleteDeviceRoute(req, res) {
  const user = req.user;
  const device = req.device;
  let payload = {
    success: true
  };

  if (user.__t !== "Lecturer") {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  Lecturer.populate(user, "devices")
    .then(function(lecturer) {
      if (!lecturer) throw new Error();

      let index = 0;
      for (let d of lecturer.devices) {
        if (device._id.equals(d._id)) {
          lecturer.devices.splice(index, 1);
          break;
        }
        index++;
      }

      return lecturer.save();
    })
    .then(function(lecturer) {
      if (!lecturer) throw new Error();

      return device.remove();
    })
    .then(function(device) {
      if (!device) throw new Error();

      res.json(payload);
    })
    .catch(function(err) {
      if (!payload.message) {
        payload.message = "unable to remove device";
      }
      payload.success = false;
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
function deviceCleanupRoute(req, res) {
  let payload = {
    success: true
  };

  res.json(payload);
}

module.exports = router;
