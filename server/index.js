//TODO: ADD LOGGER

const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const { crossOrigin } = require("./middleware");
const routes = require("./routes");
const config = require("./config-server");

const app = express();

// All cross origin resource sharing
app.use(fileupload());
app.use(crossOrigin);
app.use(bodyParser.json());

// Routes defined
app.use("/", routes);
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
