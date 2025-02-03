const Recommendation = require("../../models/recommendation.model");

const hasRecommendation = async (userId, groupId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return Recommendation.find({
    groupId: groupId,
    userId: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
};

module.exports = { hasRecommendation };
