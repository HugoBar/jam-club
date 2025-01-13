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

// Add a custom static method to the schema to find recommendations for today by given user IDs
recommendationSchema.statics.findTodayByUsers = function (userIds) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  console.log(this);

  return this.find({
    userId: { $in: userIds }, 
    createdAt: { $gte: startOfDay, $lte: endOfDay }, 
  });
};

module.exports = mongoose.model("Recommendation", recommendationSchema);
