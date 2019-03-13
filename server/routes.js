const express = require("express");
const axios = require("axios");
const { Device, Video, User } = require("./models");
const { getDevice } = require("./middleware");

const router = express.Router();

// API Routes Device
router.get("/:deviceid/ping", getDevice, devicePingRoute);

// API Routes Frontend
router.get("/devices", getDevicesRoute);
router.get("/:deviceid/status", getDevice, deviceStatusRoute);
router.get("/:deviceid/record", getDevice, deviceRecordRoute);
router.get("/:deviceid/rotate", getDevice, deviceRotateRoute);
router.get("/:deviceid/cleanup", deviceCleanupRoute);

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
