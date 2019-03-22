const jwt = require("jwt-simple");
const { Lecturer, Viewer } = require("./models");
const { jwt_secret } = require("./secrets.json");

function getAuthToken(code, expires = 3600) {
  code.expires = expires;
  return jwt.encode(code, jwt_secret);
}

async function saveUser(data, lecturerEmail) {
  let promise;

  if (lecturerEmail) {
    promise = Lecturer.findOne({ email: lecturerEmail }).then(function(doc) {
      if (!doc) return { message: "no lecturer found" };

      data.lecturers = [doc];
      return new Viewer(data).save();
    });
  } else {
    promise = new Lecturer(data).save();
  }

  return await promise;
}

exports = {
  saveUser,
  getAuthToken
};

module.exports = exports;
