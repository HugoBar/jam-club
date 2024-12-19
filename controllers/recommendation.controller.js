const Recommendation = require("../models/recommendation.model");

class RecommendationController {
  static async addRecommendation(req, res) {
    const { user_id: userId, title, artist } = req.body;
    console.log("user id", userId);

    const recommendation = new Recommendation({ userId, title, artist });

    await recommendation.save();
    res.status(201).json({ message: "Recommendation registered successfully" });
  }

  static async getRecommendation(req, res) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const recommendations = await Recommendation.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      res.status(200).json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Server error. Could not fetch recommendations." });
    }
  }

  static async getAllRecommendations(req, res) {
    try {
      const recommendations = await Recommendation.find();
      res.status(200).json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res
        .status(500)
        .json({ message: "Server error. Could not fetch recommendations." });
    }
  }
}

module.exports = RecommendationController;
