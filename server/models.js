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
  name: { type: String, required: true },
  filename: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  views: { type: Number, default: 0 },
  device: { type: String }
});
const Video = model("Video", videoSchema);

// Device Model
const deviceSchema = new Schema({
  id: { type: Number, required: true },
  address: { type: String },
  name: { type: String }
});
const Device = model("Device", deviceSchema);

const options = { discriminatorKey: "kind" };
const userSchema = new Schema(
  {
    name: {
      first: { type: String, lowercase: true, required: true, trim: true },
      last: { type: String, lowercase: true, required: true, trim: true }
    },
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true }
  },
  options
);
const User = model("User", userSchema);

// Lecturer Model
const lecturerSchema = new Schema(
  {
    devices: [{ type: Schema.Types.ObjectId, unique: true, ref: "Device" }],
    videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    viewers: [{ type: Schema.Types.ObjectId, unique: true, ref: "Viewer" }]
  },
  options
);
const Lecturer = User.discriminator("Lecturer", lecturerSchema, "lecturer");

// Viewer Model
const viewerSchema = new Schema({
  lecturers: [{ type: String, unique: true, required: true }]
});
const Viewer = User.discriminator("Viewer", viewerSchema, "viewer");

exports = {
  Host,
  Video,
  Device,
  User,
  Lecturer,
  Viewer
};

module.exports = exports;
