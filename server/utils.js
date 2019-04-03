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

function formatName(user) {
  return (
    user.name.first.slice(0, 1).toUpperCase() +
    user.name.first.slice(1) +
    " " +
    user.name.last.slice(0, 1).toUpperCase() +
    user.name.last.slice(1)
  );
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
  hasValidFields,
  decodeToken,
  getAuthToken,
  formatName,
  formatDate
};

module.exports = exports;
