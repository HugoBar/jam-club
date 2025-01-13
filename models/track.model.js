const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    artists: [{ type: String, required: true }],
    external_urls: { type: mongoose.Schema.Types.Mixed, default: {} },
    // cover: { type: String, required: true },
    // releaseYear: { type: String, required: true },
    // genres: [{ type: String, required: true }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("track", trackSchema);
