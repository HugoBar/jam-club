const Track = require("../models/track.model");
const { fetchTrackDetails } = require("../helpers/api/fetchTrackData.helper");
const { mapTrackDetails } = require("../helpers/track/mapTrackDetails.helper");

class TrackController {
  // Create a new track
  static async setDailyTrack(req, res) {
    const { track_id: trackId } = req.body;

    const track = new Track({ spotifyId: trackId });
    await track.save();

    res.status(201).json({ message: "Track created successfully", track });
  }

  // Fetch track created today
  static async getDailyTrack(req, res) {
    try {
      // Find track created today
      const track = await Track.findTodayTrack().lean(); // return plain js object

      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }

      // Fetch detailed track information using the Spotify API
      const details = await fetchTrackDetails(
        track.spotifyId,
        req.spotifyToken
      );

      const trackDetails = mapTrackDetails(track, details);

      res.status(200).json(trackDetails);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching track:", error);
      res.status(500).json({ message: "Server error. Could not fetch track." });
    }
  }

  // Fetch all tracks
  static async getAllTracks(req, res) {
    try {
      const tracks = await Track.find();

      res.status(200).json(tracks);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching tracks:", error);
      res
        .status(500)
        .json({ message: "Server error. Could not fetch tracks." });
    }
  }
}

module.exports = TrackController;
