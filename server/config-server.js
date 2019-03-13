const os = require("os");
const mongoose = require("mongoose");
const { Host } = require("./models");
const config_file = require("./config.json");

const mongoose_options = { useNewUrlParser: true, useCreateIndex: true };
const env = process.env.NODE_ENV || "development";
const config = config_file[env];
const server_name = config.server_name;
const mainDB = config.database;
const interfaces = os.networkInterfaces();

// Get external ip address
let ips = [];
for (let interface in interfaces) {
  for (let address of interfaces[interface]) {
    if (
      address.family === "IPv4" &&
      address.address !== "127.0.0.1" &&
      !address.internal
    ) {
      ips.push(address.address);
    }
  }
}

// Connect to mongoDB
mongoose
  .connect(mainDB, mongoose_options)
  .then(saveHost)
  .catch(err => console.log(err));

/**
 *
 */
function saveHost(db) {
  const address =
    "http://" + (ips ? ips[0] : "127.0.0.1") + ":" + config.node_port;

  host = new Host({ name: server_name, address: address });
  Host.findOne({ name: host.name })
    .then(function(doc) {
      // Save host if not found
      if (!doc) {
        host.save().catch(err => console.log(err));
        return;
      }

      // Update address if changed
      if (doc.address !== host.address) {
        doc.updateOne({ address: host.address }).catch(err => console.log(err));
        return;
      }
    })
    .catch(err => console.log(err));
}

module.exports = config;
