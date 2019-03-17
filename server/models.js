const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Host Schema
const hostSchema = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true }
});
const Host = model("Host", hostSchema);

// Video Model
const videoSchema = new Schema({
  name: { type: String, require: true },
  camera: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
  video: { data: Buffer, contentType: String },
  duration: { type: Number },
  date: { type: Date, default: Date.now },
  description: { type: String }
});
const Video = model("Video", videoSchema);

// Device Model
const deviceSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  address: { type: String, require: true },
  name: String
});
const Device = model("Device", deviceSchema);

// User Model
const userSchema = new Schema({});
const User = model("User", userSchema);

exports = {
  Host,
  Video,
  Device,
  User
};

module.exports = exports;
