const Track = require("../models/track.model");
const { fetchTrackData } = require("../helpers/api/fetchTrackData.helper");

class TrackController {
  // Static method to handle adding a new track
  static async setDailyTrack(req, res) {
    try {
      const { track_id } = req.body;

      const { name, artists, external_urls } = await fetchTrackData(track_id, req.spotifyToken);

      const artistsNames = artists.map(a => a.name) 
  
      const track = new Track({ name, artists: artistsNames, external_urls })
      await track.save()
  
      res.status(201).json({ message: "Track created successfully", track });
    } catch (error) {
      console.error("Error in set daily track:", error);

      return res.status(500).json({ message: "An error occurred while processing your request." });   
    }
  }

  // Static method to fetch track created today
  static async getDailyTrack(req, res) {
    try {
      // Set the start of the day to 00:00:00
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Set the end of the day to 23:59:59.999
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Find track created today, using the start and end of the day as a range
      const track = await Track.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      // Respond with the list of track created today
      res.status(200).json(track);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching track:", error);
      res.status(500).json({ message: "Server error. Could not fetch track." });
    }
  }

  // Static method to fetch all tracks
  static async getAllTracks(req, res) {
    try {
      const tracks = await Track.find();

      // Respond with the list of all tracks
      res.status(200).json(tracks);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching tracks:", error);
      res.status(500).json({ message: "Server error. Could not fetch tracks." });
    }
  }
}

module.exports = TrackController;
