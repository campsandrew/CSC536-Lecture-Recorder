const { Device, Video, User, Lecturer, Viewer } = require("./models");
const { decodeToken } = require("./utils");

/**
 *
 */
function crossOrigin(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, AccessToken"
  );
  next();
}

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

/**
 *
 */
function authUser(req, res, next) {
  let token = req.headers.accesstoken;
  let decode = decodeToken(token);
  let payload = {
    success: false,
    message: "unauthorized access"
  };

  if (!decode || !decode.email) {
    return res.status(401).json(payload);
  }

  // Find device and attach to request object
  User.findOne({ email: decode.email })
    .then(function(doc) {
      req.user = doc;
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
  crossOrigin,
  getDevice,
  authUser
};

module.exports = exports;
