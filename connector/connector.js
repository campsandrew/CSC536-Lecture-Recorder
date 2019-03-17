const mongoose = require("mongoose");

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const mongodb = process.env.MONGO_URI;
const uri = `mongodb://${username}:${password}@${mongodb}`;
const server_name = process.env.SERVER_NAME;
const hostSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true }
});

let db = null;

/**
 * Connector Handler
 */
exports.handler = async function(event, context) {
  let payload = {
    statusCode: 200,
    body: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      success: true
    }
  };

  context.callbackWaitsForEmptyEventLoop = false;

  if (db == null) {
    db = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });

    db.model("Host", hostSchema);
  }

  const Host = db.model("Host");
  const doc = await Host.findOne({ name: server_name });

  payload.body.address = doc.address;
  if (!doc) {
    payload.body.success = false;
    payload.body.message = "no server address found in database";
  }

  payload.body = JSON.stringify(payload.body);
  return payload;
};
