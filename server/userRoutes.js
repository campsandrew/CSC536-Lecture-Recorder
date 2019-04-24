const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt-nodejs");
const { authUser } = require("./middleware");
const { User, Lecturer, Viewer } = require("./models");
const { getAuthToken, hasValidFields } = require("./utils");

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

  if (!(user instanceof Viewer)) {
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

      if (user.lecturers.indexOf(lecturer.email.toLowerCase()) >= 0) {
        payload.message = "already subscribed to lecturer";
        throw new Error();
      }

      lecturer.viewers.push(user);
      user.lecturers.push(lecturer.email);
      return Promise.all([lecturer.save(), user.save()]);
    })
    .then(function(response) {
      if (!response[0] || !response[1]) throw new Error();

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
      return user.kind.toLowerCase();
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
  if (isLecturer) {
    return Lecturer.create(userData)
      .then(function(lecturer) {
        if (!lecturer) throw new Error();

        payload.auth = getAuthToken({ email: lecturer.email });
        payload.user = lecturer;
        return res.json(payload);
      })
      .catch(function(err) {
        console.log(err);
        payload.message = "error creating account";
        if (err.code === 11000) {
          payload.message = "email already registered";
        }
        payload.success = false;
        return res.json(payload);
      });
  }

  // Find lecturer so viewer can add them
  let viewer;
  Lecturer.findOne({ email: req.body.lecturerEmail })
    .then(function(lecturer) {
      if (!lecturer) {
        payload.message = "no lecturer found";
        throw new Error();
      }

      viewer = new Viewer(userData);
      lecturer.viewers.push(viewer);
      viewer.lecturers.push(lecturer.email);
      return Promise.all([viewer.save(), lecturer.save()]);
    })
    .then(function(response) {
      if (!response[0] || !response[1]) throw new Error();

      payload.auth = getAuthToken({ email: response[0].email });
      payload.user = response[0];
      return res.json(payload);
    })
    .catch(function(err) {
      console.log(err);
      if (!payload.message) {
        payload.message = "error creating account";
      }

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
