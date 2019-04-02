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
function getAuthToken(code, expires = 3000) {
  code.expires = expires * 1000 + new Date().getTime();
  return { accessToken: jwt.encode(code, jwt_secret), expiresAt: code.expires };
}

/**
 *
 */
// function canAddLecturer(user, lecturer) {
//   for (let l of user.lecturers) {
//     if (l._id.equals(lecturer._id)) {
//       return false;
//     }
//   }

//   return true;
// }

/**
 *
 */
// function canAddDevice(user, newDevice) {
//   for (let device of user.devices) {
//     if (newDevice.id === device.id) {
//       return false;
//     }
//   }

//   return true;
// }

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

exports = {
  //canAddDevice,
  //canAddLecturer,
  hasValidFields,
  decodeToken,
  getAuthToken,
  formatDate
};

module.exports = exports;
