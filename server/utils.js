const { Lecturer, Viewer } = require("./models");

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
  saveUser
};

module.exports = exports;
