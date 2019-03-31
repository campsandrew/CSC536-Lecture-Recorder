const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt-nodejs");
const { authUser } = require("./middleware");
const { User, Lecturer, Viewer } = require("./models");
const {
  saveUser,
  getAuthToken,
  hasValidFields,
  canAddLecturer
} = require("./utils");

const router = express.Router();

// API Frontend Routes
router.get("/user", authUser, getUserRoute);
router.post("/user", addUserRoute);
router.post("/user/login", loginUserRoute);
router.put("/user/lecturer", authUser, addLecturerRoute);

function addLecturerRoute(req, res) {
  const user = req.user;
  const required = ["lecturerEmail"];
  const lecturerEmail = req.body.lecturerEmail;
  let payload = {
    success: true
  };

  // Check for proper values in body
  if (!hasValidFields(req.body, required)) {
    payload.message = "invalid fields";
    payload.success = false;
    return res.json(payload);
  }

  if (user.__t !== "Viewer") {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  // Add lecturer to viewer
  Lecturer.findOne({ email: lecturerEmail })
    .then(function(lecturer) {
      if (!lecturer) {
        payload.message = "no lecturer found";
        throw new Error();
      }

      if (!canAddLecturer(user, lecturer)) {
        payload.message = "lecturer already registered";
        throw new Error();
      }

      lecturer.viewers.push(user);
      return lecturer.save();
    })
    .then(function(lecturer) {
      if (!lecturer) throw new Error();

      user.lecturers.push(lecturer);
      return user.save();
    })
    .then(function(viewer) {
      if (!viewer) throw new Error();

      res.json(payload);
    })
    .catch(function(err) {
      console.log(err);
      if (!payload.message) {
        payload.message = "unable to add lecturer";
      }
      payload.success = false;
      res.json(payload);
    });
}

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
  saveUser(userData, req.body)
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
      payload.auth = getAuthToken(code);
      payload.user = response;
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
  if (!hasValidFields(req.body, required)) {
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
      payload.auth = getAuthToken(code);
      payload.user = doc;
      return res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = "invalid email or password";
      return res.json(payload);
    });
}

module.exports = router;
