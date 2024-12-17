const mongoose = require("mongoose");

const dailySongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("dailySong", dailySongSchema);
