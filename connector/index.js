const express = require("express");
const mongoose = require("mongoose");
const config_file = require("./config.json");

const mongoose_options = { useNewUrlParser: true, useCreateIndex: true };
const env = process.env.NODE_ENV || "development";
const config = config_file[env];
const mainDB = config.database;
const app = express();

// Host Schema
const { Schema, model } = mongoose;
const hostSchema = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true }
});
const Host = model("Host", hostSchema);

// Connect to mongoDB
mongoose.connect(mainDB, mongoose_options).catch(err => console.log(err));

// All cross origin resource sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes defined
app.use("/connector", connectorRoute);
app.use(errorRoute);

// Start server
app.listen(config.node_port, function() {
  console.log("Listening on Port: " + config.node_port);
});

/**
 *
 */
function connectorRoute(req, res) {
  let payload = {
    success: true
  };

  Host.findOne({ name: config.server_name })
    .then(function(doc) {
      if (!doc) {
        payload.success = false;
        message: "no server address found in database";
      }

      payload.address = doc.address;
      res.json(payload);
    })
    .catch(function(err) {
      payload.success = false;
      message: "database error";
      res.json(payload);
    });
}

/**
 *
 */
function errorRoute(req, res) {
  let payload = {
    success: false,
    message: "404 not found"
  };

  res.status(404).json(payload);
}
