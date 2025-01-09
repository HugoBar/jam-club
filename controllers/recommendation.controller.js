const Recommendation = require("../models/recommendation.model");

class RecommendationController {
  // Static method to handle adding a new recommendation
  static async addRecommendation(req, res) {
    const { user_id: userId, title, artist } = req.body;

    const recommendation = new Recommendation({ userId, title, artist });

    await recommendation.save();

    // Respond with a success message and a 201 status code (created)
    res.status(201).json({ message: "Recommendation registered successfully", recommendation });
  }

  // Static method to fetch recommendations for the current day
  static async getRecommendation(req, res) {
    try {
      // Set the start of the day to 00:00:00
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Set the end of the day to 23:59:59.999
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Find recommendations created today, using the start and end of the day as a range
      const recommendations = await Recommendation.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      // Respond with the list of recommendations for today
      res.status(200).json(recommendations);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching recommendations:", error);
      res
        .status(500)
        .json({ message: "Server error. Could not fetch recommendations." });
    }
  }

  // Static method to fetch all recommendations
  static async getAllRecommendations(req, res) {
    try {
      const recommendations = await Recommendation.find();

      // Respond with the list of all recommendations
      res.status(200).json(recommendations);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching recommendations:", error);
      res
        .status(500)
        .json({ message: "Server error. Could not fetch recommendations." });
    }
  }
}

module.exports = RecommendationController;
