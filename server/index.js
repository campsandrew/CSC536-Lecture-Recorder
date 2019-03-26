//TODO: ADD LOGGER

const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const deviceRouter = require("./deviceRoutes");
const videoRouter = require("./videoRoutes");
const userRouter = require("./userRoutes");
const { crossOrigin } = require("./middleware");

const config = require("./config-server");
global.config = config;

const app = express();

// All cross origin resource sharing
app.use(fileupload());
app.use(crossOrigin);
app.use(bodyParser.json());

// Routes defined
app.use("/", deviceRouter);
app.use("/", videoRouter);
app.use("/", userRouter);
app.use(errorRoute);

// Start server
app.listen(config.node_port, function() {
  console.log("Listening on Port: " + config.node_port);
});

/**
 *
 */
function errorRoute(req, res, next) {
  let payload = {
    success: false,
    message: "404 not found"
  };

  res.status(404).json(payload);
}
