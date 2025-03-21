const Recommendation = require("../models/recommendation.model");
const { fetchTrackDetails, fetchTracksDetails } = require("../helpers/api/fetchTrackData.helper");
const { mapTrackDetails, mapTracksDetails } = require("../helpers/track/mapTrackDetails.helper");

const { hasRecommendation } = require("../helpers/recommendation/recommendation.helper")

class RecommendationController {
  // Create a new recommendation
  static async addRecommendation(req, res) {
    try {
      const { spotifyId } = req.body;
      const { id: groupId } = req.params;
      const userId = req.userId;
  
      let recommendation = await hasRecommendation(userId, groupId);

      if (recommendation.length > 0) {
        return res.status(500).json({ error: "User already has a recommendation for this group" });
      }

      recommendation = new Recommendation({ userId, groupId, spotifyId });
      await recommendation.save();
  
      res.status(201).json({
        message: "Recommendation created successfully",
        recommendation,
      });
    } catch (error) {
      // Log any error and send a failure response
      console.error("Error creating recommendation:", error);
      res.status(500).json({ error: "Server Error. Could not create recommendation." });
    }
    
  }

  // Fetch recommendations for the current day for a group
  static async getRecommendations(req, res) {
    try {
      const { id: groupId } = req.params;

      // Find today's recommendations for the group
      const recommendations = await Recommendation.findTodayRecommendations(
        groupId
      )
        .populate("userId")
        .lean();

      if (recommendations.length === 0) {
        return res.status(200).json([]);
      }
      
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

  static async getRecommendationByUser(req, res) {
    try {
      const { id: groupId } = req.params;
      const userId = req.userId;

      // Find today's recommendations for the group
      const recommendation = await Recommendation.findTodayRecommendationsByUser(
        groupId, userId
      ).lean();

      if (!recommendation) {
        return res.status(200).json("");
      }

      // Fetch detailed track information using Spotify API
      const details = await fetchTrackDetails(recommendation.spotifyId, req.spotifyToken);

      const recommendationDetails = mapTrackDetails(recommendation, details);

      res.status(200).json(recommendationDetails);
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
