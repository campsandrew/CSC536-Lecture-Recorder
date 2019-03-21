const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt-nodejs");
const { authUser } = require("./middleware");
const { Lecturer, Viewer } = require("./models");

const router = express.Router();

// API Frontend Routes
router.post("/user", userRoute);
router.post("/user/login", loginRoute);

/**
 *
 */
function userRoute(req, res) {
  const isLecturer = req.body.isLecturer;
  let required = [
    "email",
    "password",
    "firstName",
    "lastName",
    "isLecturer",
    "lecturerEmail"
  ];
  let user;
  let userData = { name: {} };
  let payload = {
    success: true
  };

  // Check for proper values in body
  for (let key of required) {
    if (key !== "lecturerEmail" && key in req.body) {
      continue;
    } else if (key === "lecturerEmail" && req.body.isLecturer) {
      continue;
    } else if (key === "lecturerEmail" && !isLecturer && key in req.body) {
      continue;
    }

    payload.message = "not enough fields in body";
    payload.success = false;
    return res.json(payload);
  }

  userData.name.first = req.body.firstName;
  userData.name.last = req.body.lastName;
  userData.email = req.body.email;
  userData.hash = bcrypt.hashSync(req.body.password);

  if (isLecturer) {
    user = new Lecturer(userData);
  } else {
    // Lecturer.findOne({ email: email })
    //   .then(function(doc) {
    //     if (!doc) {
    //       payload.message = "lecturer found";
    //       payload.success = false;
    //       return res.json(payload);
    //     }
    //     userData.lecturers.push(doc);
    //     user = new Viewer(userData);
    //     return user;
    //   })
    //   .then(function(doc) {
    //     console.log(doc);
    //   })
    //   .catch(function(err) {
    //     payload.message = errmsg;
    //     payload.success = false;
    //     return res.json(payload);
    //   });
  }

  user
    .save()
    .then(function(doc) {
      if (!doc) {
        payload.message = "error creating account";
        payload.success = false;
        return res.json(payload);
      }

      return res.json(payload);
    })
    .catch(function(err) {
      payload.message = "error creating account";
      payload.success = false;
      return res.json(payload);
    });
}

/**
 *
 */
function loginRoute(req, res) {
  let payload = {
    success: true
  };

  res.json(payload);
}

module.exports = router;
