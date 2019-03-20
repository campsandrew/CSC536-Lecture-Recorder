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
  video: { data: Buffer, contentType: String },
  duration: { type: Number },
  date: { type: Date, default: Date.now },
  description: { type: String },
  views: { type: Number, default: 0 },
  camera: { type: Schema.Types.ObjectId, ref: "Device" },
  lecturer: { type: Schema.Types.ObjectId, ref: "Lecturer" }
});
const Video = model("Video", videoSchema);

// Device Model
const deviceSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  address: { type: String, require: true },
  name: { type: String },
  api: { type: String }
});
const Device = model("Device", deviceSchema);

// User Model
//const options = { discriminatorKey: "kind" };
const userSchema = new Schema({
  name: {
    first: { type: String, require: true, trim: true },
    last: { type: String, require: true, trim: true }
  },
  email: { type: String, require: true, unique: true },
  hash: { type: String, require: true }
});
const User = model("User", userSchema);

// Lecturer Model
const lecturerSchema = new Schema({
  devices: [{ type: Schema.Types.ObjectId, ref: "Device" }],
  videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  viewers: [{ type: Schema.Types.ObjectId, ref: "Viewer" }]
});
const Lecturer = User.discriminator("Lecturer", lecturerSchema);

// Viewer Model
const viewerSchema = new Schema({
  lecturers: [{ type: Schema.Types.ObjectId, ref: "Lecturer" }]
});
const Viewer = User.discriminator("Viewer", viewerSchema);

exports = {
  Host,
  Video,
  Device,
  User,
  Lecturer,
  Viewer
};

module.exports = exports;
