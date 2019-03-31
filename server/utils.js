const jwt = require("jwt-simple");
const { Lecturer, Viewer } = require("./models");
const { jwt_secret } = require("./secrets.json");

/**
 *
 */
function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return month + "/" + day + "/" + year;
}

/**
 *
 */
function getAuthToken(code, expires = 300) {
  code.expires = expires * 1000 + new Date().getTime();
  return { accessToken: jwt.encode(code, jwt_secret), expiresAt: code.expires };
}

/**
 *
 */
function canAddLecturer(user, lecturer) {
  for (let l of user.lecturers) {
    if (l._id.equals(lecturer._id)) {
      return false;
    }
  }

  return true;
}

/**
 *
 */
function canAddDevice(user, newDevice) {
  for (let device of user.devices) {
    if (newDevice.id === device.id) {
      return false;
    }
  }

  return true;
}

/**
 *
 */
function decodeToken(token) {
  let decode;

  try {
    decode = jwt.decode(token, jwt_secret);
  } catch (err) {
    // do nothing
  }

  return decode;
}

/**
 *
 */
function hasValidFields(fields, required) {
  for (let key of required) {
    if (key in fields) {
      continue;
    }

    return false;
  }

  return true;
}

/**
 *
 */
async function saveUser(data, body) {
  let promise;

  if (body.isLecturer == "false") {
    let viewer;
    promise = Lecturer.findOne({ email: body.lecturerEmail })
      .then(function(lecturer) {
        if (!lecturer) return { message: "lecturer not found" };

        viewer = new Viewer(data);
        lecturer.viewers.push(viewer);
        return lecturer.save();
      })
      .then(function(lecturer) {
        if (!lecturer) return { message: "error adding viewer to lecturer" };

        viewer.lecturers = [lecturer];
        return viewer.save();
      });
  } else {
    promise = new Lecturer(data).save();
  }

  return await promise;
}

exports = {
  saveUser,
  canAddDevice,
  canAddLecturer,
  hasValidFields,
  decodeToken,
  getAuthToken,
  formatDate
};

module.exports = exports;
