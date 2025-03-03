const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true  },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    spotifyId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Add a custom static method to the schema to find recommendations for today in given group ID
recommendationSchema.statics.findTodayRecommendations = function (groupId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    groupId: groupId, 
    createdAt: { $gte: startOfDay, $lte: endOfDay }, 
  });
};

recommendationSchema.statics.findTodayRecommendationsByUser = function (groupId, userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    groupId: groupId, 
    userId: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay }, 
  });
};

module.exports = mongoose.model("Recommendation", recommendationSchema);
