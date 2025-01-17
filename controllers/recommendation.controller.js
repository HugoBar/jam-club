const Recommendation = require("../models/recommendation.model");
const { fetchTracksDetails } = require("../helpers/api/fetchTrackData.helper");
const { mapTracksDetails } = require("../helpers/track/mapTrackDetails.helper");

class RecommendationController {
  // Create a new recommendation
  static async addRecommendation(req, res) {
    const { spotify_id: spotifyId } = req.body;
    const { id: groupId } = req.params;
    const userId = req.userId;

    const recommendation = new Recommendation({ userId, groupId, spotifyId });
    await recommendation.save();

    res.status(201).json({
      message: "Recommendation registered successfully",
      recommendation,
    });
  }

  // Fetch recommendations for the current day for a group
  static async getRecommendations(req, res) {
    try {
      const { id: groupId } = req.params;

      // Find today's recommendations for the group
      const recommendations = await Recommendation.findTodayRecommendations(
        groupId
      ).lean();

      // Extract the track IDs from the recommendations
      const ids = recommendations.map(({ spotifyId }) => spotifyId);

      // Fetch detailed track information using Spotify API
      const details = await fetchTracksDetails(ids.join(","), req.spotifyToken);

      const recommendationsDetails = mapTracksDetails(recommendations, details);

      res.status(200).json(recommendationsDetails);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching recommendations:", error);
      res
        .status(500)
        .json({ message: "Server error. Could not fetch recommendations." });
    }
  }

  // Fetch all recommendations for a group
  static async getAllRecommendation(req, res) {
    try {
      const { id: groupId } = req.params;

      // Retrieve all recommendations for the specified group
      const recommendations = await Recommendation.find({ groupId }).lean();

      // Extract the Spotify track IDs from the recommendations
      const ids = recommendations.map(({ spotifyId }) => spotifyId);

      // Fetch detailed track information using Spotify API
      const details = await fetchTracksDetails(ids.join(","), req.spotifyToken);

      const recommendationsDetails = mapTracksDetails(recommendations, details);

      res.status(200).json(recommendationsDetails);
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
