const jwt = require("jwt-simple");
const { Device, Video, Lecturer, Viewer } = require("./models");
const { jwt_secret } = require("./secrets.json");

/**
 *
 */
function crossOrigin(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
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
  let token = req.headers.auth_token;
  let payload = {
    success: false,
    message: "unauthorized access"
  };

  if (!token) return res.status(401).json(payload);
  let decode = jwt.decode(token, jwt_secret);

  // User query using token
  next();
}

exports = {
  crossOrigin,
  getDevice,
  authUser
};

module.exports = exports;
