const { Device, Video, User } = require("./models");

/**
 *
 */
function getDevice(req, res, next) {
  let deviceId = req.params.deviceid;

  // Find device and attach to request object
  Device.findOne({ id: deviceId })
    .then(function(doc) {
      req.device = doc;
      next();
    })
    .catch(function(err) {
      console.log(err.errmsg);
      next();
    });
}

exports = {
  getDevice
};

module.exports = exports;
