const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    spotifyId: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("track", trackSchema);
