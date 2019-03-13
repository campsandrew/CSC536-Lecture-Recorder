const os = require("os");
const dns = require("dns");
const mongoose = require("mongoose");
const { Host } = require("./models");
const config_file = require("./config.json");

const mongoose_options = { useNewUrlParser: true, useCreateIndex: true };
const env = process.env.NODE_ENV || "development";
const config = config_file[env];
const server_name = config.server_name;
const mainDB = config.database;

// Connect to mongoDB
mongoose
  .connect(mainDB, mongoose_options)
  .then(function(db) {
    dns.lookup(os.hostname(), function(err, ip) {
      if (err) {
        console.log(err);
        return;
      }

      saveHost(db, ip);
    });
  })
  .catch(err => console.log(err));

/**
 *
 */
function saveHost(db, ip) {
  const address = "http://" + ip + ":" + config.node_port;

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
