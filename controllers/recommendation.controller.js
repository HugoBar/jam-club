const Recommendation = require("../models/recommendation.model");
const { fetchTracksDetails } = require("../helpers/api/fetchTrackData.helper");

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
  static async getRecommendations(req, res) {
    try {
      const { id: groupId } = req.params;

      // Find recommendations created today
      const recommendations = await Recommendation.findTodayRecommendations(
        groupId
      ).lean();

      const ids = recommendations.map(({ spotifyId }) => spotifyId);

      // Fetch track information
      const recommendationsDetails = await fetchTracksDetails(
        ids.join(","),
        req.spotifyToken
      );

      // Map fetched details to tracks
      const detailedRecommendations = recommendations.map((recommendation) => {
        const details = recommendationsDetails.find(({ id }) => {
          return id === recommendation.spotifyId;
        });
        return details
          ? {
              ...recommendation,
              name: details.name,
              artists: details.artists.map((artist) => artist.name),
              externalUrls: details.external_urls,
            }
          : recommendation;
      });

      // Respond with the list of recommendations for today
      res.status(200).json(detailedRecommendations);
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
