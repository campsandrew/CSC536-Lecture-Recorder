const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt-nodejs");
const { authUser } = require("./middleware");
const { saveUser, getAuthToken } = require("./utils");
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
  let payload = {
    success: true
  };
  let userData = { name: {} };

  // Check for proper values in body
  for (let key of required) {
    if (key !== "lecturerEmail" && key in req.body) {
      continue;
    } else if (key === "lecturerEmail" && isLecturer) {
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
  saveUser(userData, req.body.lecturerEmail)
    .then(function(response) {
      if (!response) {
        payload.message = "error creating account";
        payload.success = false;
        return res.json(payload);
      }

      if (response.message) {
        payload.message = response.message;
        payload.success = false;
        return res.json(payload);
      }

      let code = { email: response.email };
      payload.token = getAuthToken(code);
      return res.json(payload);
    })
    .catch(function(err) {
      payload.message = "error creating account";
      if (err.code === 11000) {
        payload.message = "email already registered";
      }
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
