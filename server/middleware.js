const { ObjectId } = require("mongoose").Types;
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
function getVideo(req, res, next) {
  let videoId = ObjectId(req.params.videoid);
  let payload = {
    success: false,
    message: "video not found"
  };

  // Find device and attach to request object
  Video.findOne({ _id: videoId })
    .then(function(doc) {
      req.video = doc;
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
  const q_token = req.query.accesstoken;
  const h_token = req.headers.accesstoken;
  const h_decode = decodeToken(h_token);
  const q_decode = decodeToken(q_token);
  let payload = {
    success: false,
    message: "unauthorized access"
  };
  let decode;

  if (q_decode && q_decode.email) {
    decode = q_decode;
  } else if (h_decode && h_decode.email) {
    decode = h_decode;
  } else {
    return res.status(401).json(payload);
  }

  // Find device and attach to request object
  User.findOne({ email: decode.email })
    .populate("devices")
    .then(function(doc) {
      req.user = doc;
      if (!doc) {
        return res.status(403).json(payload);
      }

      next();
    })
    .catch(function(err) {
      res.json(payload);
    });
}

exports = {
  crossOrigin,
  getDevice,
  getVideo,
  authUser
};

module.exports = exports;
