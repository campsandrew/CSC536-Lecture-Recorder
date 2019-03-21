const express = require("express");
const axios = require("axios");
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
  let required = ["email", "password", "firstName", "lastName", "isLecturer"];
  let payload = {
    success: true
  };

  // Check for proper values in body
  for (let key of required) {
    if (key in req.body && key !== "userType") {
      continue;
    } else if (
      key === "userType" &&
      key in req.body &&
      req.body[key] === "viewer"
    ) {
      if ("lecturerEmail" in req.body) {
        continue;
      }
    }

    payload.success = false;
    payload.message = "not enough fields in body";
    return res.json(payload);
  }

  res.json(payload);
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
