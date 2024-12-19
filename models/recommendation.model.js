const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
