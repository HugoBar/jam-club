const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    artist: { type: String, required: true},
  },
  {
    timestamps: true,
  }
);

recommendationSchema.statics.findTodayByUsers = function(userIds) {
  // Get today's start and end date
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Start of today

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // End of today
  console.log(this)
  return this.find({
    userId: { $in: userIds },
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });
};

module.exports = mongoose.model("Recommendation", recommendationSchema);
