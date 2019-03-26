const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { hasValidFields, formatDate } = require("./utils");
const { authUser, getVideo, getDevice } = require("./middleware");
const { Video, Lecturer, Viewer } = require("./models");

const router = express.Router();

// API Frontend Routes - Videos
router.post("/video/:deviceid", authUser, getDevice, addVideoRoute);
router.get("/videos", authUser, getVideosRoute);
router.delete("/video/:videoid/delete", authUser, getVideo, deleteVideoRoute);
router.get("/video/:videoid/view/:filename", authUser, viewVideoRoute);
router.put("/video/:videoid/view", authUser, getVideo, addViewRoute);

/**
 *
 */
function getVideosRoute(req, res) {
  const user = req.user;
  let payload = {
    success: true
  };

  if (user.__t === "Lecturer") {
    Lecturer.populate(user, "videos")
      .then(function(lecturer) {
        if (!lecturer) {
          throw new Error();
        }

        let videos = [];
        for (let v of lecturer.videos) {
          let video = {
            id: v._id,
            name: v.name,
            filename: v.filename,
            date: formatDate(v.date),
            description: v.description,
            views: v.views,
            device: v.device
          };
          videos.push(video);
        }

        payload.videos = videos;
        res.json(payload);
      })
      .catch(function(err) {
        console.log(err);
        if (!payload.message) {
          payload.message = "unable to get videos";
        }
        payload.success = false;
        res.json(payload);
      });
  }

  if (user.__t === "Viewer") {
    Viewer.populate(user, "lecturers")
      .then(function(viewer) {
        if (!viewer) {
          throw new Error();
        }

        let promises = [];
        for (let lecturer of viewer.lecturers) {
          promises.push(Lecturer.populate(lecturer, "videos"));
        }

        return Promise.all(promises);
      })
      .then(function(docs) {
        if (!docs) throw new Error();

        let videos = [];
        for (let l of docs) {
          for (let v of l.videos) {
            let video = {
              id: v._id,
              name: v.name,
              filename: v.filename,
              date: formatDate(v.date),
              description: v.description,
              views: v.views,
              device: v.device,
              lecturer: l.name.first + " " + l.name.last
            };
            videos.push(video);
          }
        }

        payload.videos = videos;
        res.json(payload);
      })
      .catch(function(err) {
        console.log(err);
        if (!payload.message) {
          payload.message = "unable to get videos";
        }
        payload.success = false;
        res.json(payload);
      });
  }
}

/**
 *
 */
function addViewRoute(req, res) {
  const video = req.video;
  let payload = {
    success: true
  };

  video.views++;
  video
    .save()
    .then(function(video) {
      if (!video) {
        throw new Error();
      }

      res.json(payload);
    })
    .catch(function(err) {
      console.log(err);
      if (!payload.message) {
        payload.message = "error updating video views";
      }

      payload.success = false;
      return res.json(payload);
    });
}

/**
 * TODO: verify user has access to video by looking at videoids in user
 * TODO: add view from user if play button clicked
 */
function viewVideoRoute(req, res) {
  const videoPath = path.join(
    global.config.video_path,
    req.params.filename + ".mp4"
  );
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  const user = req.user;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
}

/**
 *
 */
function addVideoRoute(req, res) {
  const required = ["name", "description"];
  const user = req.user;
  const device = req.device;
  let payload = {
    success: true
  };

  // Check for proper values in body
  if (!hasValidFields(req.body, required)) {
    payload.message = "invalid fields";
    payload.success = false;
    return res.json(payload);
  }

  if (user.__t !== "Lecturer") {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  // Create new video
  let video = new Video({
    name: req.body.name,
    description: req.body.description,
    lecturer: user,
    device: device.name
  });
  video.filename = video._id + ".mp4";
  video
    .save()
    .then(function(video) {
      if (!video) {
        payload.message = "error saving video";
        throw new Error();
      }

      user.videos.push(video);
      return user.save();
    })
    .then(function(user) {
      if (!user) {
        payload.message = "error saving video to user";
        throw new Error();
      }

      res.json(payload);
    })
    .catch(function(err) {
      console.log(err);
      if (!payload.message) {
        payload.message = "unable to save video";
      }

      payload.success = false;
      return res.json(payload);
    });
}

/**
 *
 */
function deleteVideoRoute(req, res) {
  const user = req.user;
  const video = req.video;
  let payload = {
    success: true
  };

  if (user.__t !== "Lecturer") {
    payload.message = "invalid user request";
    payload.success = false;
    return res.status(401).json(payload);
  }

  // Delete video
  Lecturer.populate(user, "videos")
    .then(function(lecturer) {
      if (!lecturer) throw new Error();

      // Remove device from user devices
      let index = 0;
      for (let v of lecturer.videos) {
        if (video._id.equals(v._id)) {
          lecturer.videos.splice(index, 1);
          break;
        }
        index++;
      }

      return lecturer.save();
    })
    .then(function(lecturer) {
      if (!lecturer) throw new Error();

      return video.remove();
    })
    .then(function(video) {
      if (!video) throw new Error();

      res.json(payload);
    })
    .catch(function(err) {
      console.log(err);
      if (!payload.message) {
        payload.message = "unable to remove video";
      }
      payload.success = false;
      res.json(payload);
    });
}

module.exports = router;
