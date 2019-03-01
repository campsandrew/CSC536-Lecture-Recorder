const express = require("express");
const axios = require("axios");
const { Device, Video, User } = require("./models");
const { getDevice } = require("./middleware");

const router = express.Router();

// API Routes Device
router.get("/:deviceid/ping", getDevice, devicePingRoute);

// API Routes Frontend
router.get("/:deviceid/status", getDevice, deviceStatusRoute);
router.get("/:deviceid/start", deviceStartRoute);
router.get("/:deviceid/stop", deviceStopRoute);
router.get("/:deviceid/cleanup", deviceCleanupRoute);
router.get("/:deviceid/rotate", deviceRotateRoute);

/**
 *
 */
function devicePingRoute(req, res) {
  let address = req.query.address;
  let device = req.device;
  let payload = {
    success: true
  };

  // Check for device
  if (!device) {
    payload.success = false;
    payload.message = "device not registed";
    res.status(403).json(payload);
  }

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
function deviceStatusRoute(req, res) {
  let device = req.device;
  let payload = {
    success: true
  };

  // Check for device
  if (!device) {
    return;
  }

  // Send device status request
  axios
    .get(`http://${device.address}/status`)
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
function deviceStartRoute(req, res) {
  let payload = {
    success: true
  };

  res.json(payload);
}

/**
 *
 */
function deviceStopRoute(req, res) {
  let payload = {
    success: true
  };

  res.json(payload);
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

/**
 *
 */
function deviceRotateRoute(req, res) {
  let payload = {
    success: true
  };

  res.json(payload);
}

module.exports = router;
