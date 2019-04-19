const express = require("express");
const axios = require("axios");
const { hasValidFields, formatDate } = require("./utils");
const { getDevice, getVideo, authUser } = require("./middleware");
const { Device, Lecturer, Viewer, Video } = require("./models");

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
router.post("/device/:deviceid/record", authUser, getDevice, deviceRecordRoute);
router.get(
  "/device/:deviceid/cleanup",
  authUser,
  getDevice,
  deviceCleanupRoute
);

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

  if (user instanceof Viewer) {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  // Create new device
  let device = new Device({
    id: req.body.id,
    name: req.body.name
  });

  user.devices.push(device);
  Promise.all([device.save(), user.save()])
    .then(function(response) {
      if (!response[0] || !response[1]) throw new Error();

      payload.device = {
        id: response[0].id,
        name: response[0].name
      };
      res.json(payload);
    })
    .catch(function(err) {
      console.log(err);
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

  if (user instanceof Viewer) {
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

  if (user instanceof Viewer) {
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

      return Promise.all([device.remove(), lecturer.save()]);
    })
    .then(function(response) {
      if (!response[0] || !response[1]) throw new Error();

      payload.device = response[0];
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

      payload.id = device.id;
      payload.address = device.address;
      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.id = device.id;
      payload.address = device.address;
      payload.message = "no communication with device";
      res.json(payload);
    });
}

/**
 *
 */
function deviceRecordRoute(req, res) {
  const required = ["name", "description"];
  const action = req.query.action;
  const user = req.user;
  const device = req.device;
  let payload = {
    success: true
  };

  // Check for valid query action
  if (
    !hasValidFields(req.query, "action") &&
    action !== "start" &&
    action !== "stop"
  ) {
    payload.success = false;
    payload.message = "invalid recording action";
    return res.json(payload);
  }

  // Check for proper values in body
  if (!hasValidFields(req.body, required)) {
    payload.message = "invalid fields";
    payload.success = false;
    return res.json(payload);
  }

  if (user instanceof Viewer) {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  // Create new video
  let video = new Video({
    name: req.body.name,
    description: req.body.description,
    device: device.name
  });
  video.filename = video._id + ".webm";
  user.videos.push(video);

  let url = device.address + "/" + action;
  if (action === "start") {
    url += "?filename=" + video.filename;
  }
  if (action === "start" && req.body.tracking) {
    url += "&tracking=" + req.body.tracking;
  }

  // Send record message to device
  axios
    .get(url)
    .then(function(response) {
      if (!response) {
        payload.message = "no communication with device";
        throw new Error();
      }

      // Add video device response
      payload.device = { id: device.id };
      if (response.data.success) {
        delete response.data.success;
        for (let k in response.data) {
          payload.device[k] = response.data[k];
        }
      } else {
        payload.message = response.data.message;
        throw new Error();
      }

      // Don't try to create video if stoping recording
      if (action === "stop") {
        res.json(payload);
        return null;
      } else {
        return Promise.all([video.save(), user.save()]);
      }
    })
    .then(function(response) {
      if (!response) return;
      if (!response[0] || !response[1]) throw new Error();

      payload.video = {
        id: response[0]._id,
        name: response[0].name,
        filename: response[0].filename,
        date: formatDate(response[0].date),
        description: response[0].description,
        views: response[0].views,
        device: response[0].device
      };

      return res.json(payload);
    })
    .catch(function(err) {
      console.log(err);
      if (!payload.message) {
        payload.message = "error recording lecture";
      }

      payload.device = { id: device.id, status: 2 };
      payload.success = false;
      return res.json(payload);
    });
}

/**
 *
 */
function deviceCleanupRoute(req, res) {
  let required = ["shutdown"];
  let device = req.device;
  let payload = {
    success: true
  };

  // Check for proper values in body
  if (!hasValidFields(req.query, required)) {
    payload.message = "invalid fields";
    payload.success = false;
    return res.json(payload);
  }

  // Send device status request
  axios
    .get(`${device.address}/cleanup?shutdown=${req.query.shutdown}`)
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

      payload.id = device.id;
      res.json(payload);
    })
    .catch(function(err) {
      payload.id = device.id;
      payload.success = false;
      payload.message = "no communication with device";
      res.json(payload);
    });
}

module.exports = router;
