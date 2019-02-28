//TODO: ADD LOGGER

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const config_file = require("./config.json");

const mongoose_options = { useNewUrlParser: true, useCreateIndex: true };
const env = process.env.NODE_ENV || "development";
const config = config_file[env];
const mongoDB = config.database;
const app = express();

// Add config to global
global.config = config;

// Connect to mongoDB
mongoose.connect(mongoDB, mongoose_options).catch(function(err) {
  console.log(err);
});

// Routes defined
app.use("/", routes);
app.use(errorRoute);

// Start server
app.listen(global.config.node_port, function() {
  console.log("Listening on Port: " + global.config.node_port);
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
