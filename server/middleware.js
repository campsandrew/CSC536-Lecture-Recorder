const { Device, Video, User } = require("./models");

/**
 *
 */
function getDevice(req, res, next) {
  let deviceId = req.params.deviceid;
  let payload = {
    success: false,
    message: "device not found"
  };

  // Find device and attach to request object
  Device.findOne({ id: deviceId })
    .then(function(doc) {
      req.device = doc;
      if (!doc) {
        return res.status(403).json(payload);
      }

      next();
    })
    .catch(function(err) {
      console.log(err.errmsg);
      res.json(payload);
    });
}

exports = {
  getDevice
};

module.exports = exports;
