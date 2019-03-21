const express = require("express");
const axios = require("axios");
const { authUser } = require("./middleware");
const { Video, Lecturer, Viewer } = require("./models");

const router = express.Router();

// API Frontend Routes - Videos
//router.post("/video");
router.get("/videos", getVideosRoute);

/**
 *
 */
function getVideosRoute(req, res) {
  let payload = {
    success: true
  };

  Video.find({})
    .then(function(docs) {
      payload.videos = [];
      for (let doc of docs) {
        video = {};
        payload.videos.push(video);
      }

      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      payload.message = err.errmsg;
      res.json(payload);
    });
}

module.exports = router;
