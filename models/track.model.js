const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    spotifyId: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

trackSchema.statics.findTodayTrack = function () {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return this.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay }, 
  });
};

module.exports = mongoose.model("track", trackSchema);
