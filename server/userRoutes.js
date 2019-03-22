const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt-nodejs");
const { authUser } = require("./middleware");
const { saveUser, getAuthToken } = require("./utils");
const { User, Lecturer, Viewer } = require("./models");

const router = express.Router();

// API Frontend Routes
router.get("/user", authUser, getUserRoute);
router.post("/user", addUserRoute);
router.post("/user/login", loginUserRoute);

/**
 *
 */
function getUserRoute(req, res) {
  const queries = req.query;
  const user = req.user;
  const actions = {
    name: user => {
      return (
        user.name.first.slice(0, 1).toUpperCase() +
        user.name.first.slice(1) +
        " " +
        user.name.last.slice(0, 1).toUpperCase() +
        user.name.last.slice(1)
      );
    },
    email: user => {
      return user.email;
    },
    type: user => {
      return user.__t.toLowerCase();
    }
  };
  let payload = {
    success: true
  };

  if (!user) {
    payload.success = false;
    payload.message = "no user found";
    return res.json(payload);
  }

  for (let query in queries) {
    if (query in actions && queries[query] === "true") {
      payload[query] = actions[query](user);
    }
  }

  return res.json(payload);
}

/**
 *
 */
function addUserRoute(req, res) {
  const isLecturer = req.body.isLecturer;
  const required = [
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

    payload.message = "invalid fields";
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
function loginUserRoute(req, res) {
  const required = ["email", "password"];
  const email = req.body.email;
  const password = req.body.password;
  let payload = {
    success: true
  };

  // Check for proper values in body
  for (let key of required) {
    if (key in req.body) {
      continue;
    }

    payload.message = "invalid fields";
    payload.success = false;
    return res.json(payload);
  }

  // Find user
  User.findOne({ email: email })
    .then(function(doc) {
      if (!doc || !bcrypt.compareSync(password, doc.hash)) {
        payload.success = false;
        payload.message = "invalid email or password";
        return res.json(payload);
      }

      let code = { email: email };
      payload.token = getAuthToken(code);
      return res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = "invalid email or password";
      return res.json(payload);
    });
}

module.exports = router;
