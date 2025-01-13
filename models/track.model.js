const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    spotify_id: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("track", trackSchema);
