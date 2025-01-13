const Recommendation = require("../models/recommendation.model");

class RecommendationController {
  // Static method to handle adding a new recommendation
  static async addRecommendation(req, res) {
    const { spotify_id: spotifyId } = req.body;
    const { id: groupId } = req.params;
    const userId = req.userId
    
    const recommendation = new Recommendation({ userId, groupId, spotifyId });
    await recommendation.save();

    // Respond with a success message and a 201 status code (created)
    res.status(201).json({ message: "Recommendation registered successfully", recommendation });
  }

  // Static method to fetch recommendations for the current day
  static async getRecommendation(req, res) {
    try {
      const { id: groupId } = req.params;

      // Find recommendations created today, using the start and end of the day as a range
      const recommendations = await Recommendation.findTodayRecommendations(groupId)

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
  static async getAllRecommendation(req, res) {
    try {
      const { id: groupId } = req.params;

      const recommendations = await Recommendation.find({ groupId });

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
