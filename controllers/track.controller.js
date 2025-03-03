const Track = require("../models/track.model");
const { fetchTrackDetails } = require("../helpers/api/fetchTrackData.helper");
const { mapTrackDetails } = require("../helpers/track/mapTrackDetails.helper");

const { getDailyTrack } = require("../helpers/track/track.helper")

class TrackController {
  // Create a new track
  static async setDailyTrack(req, res) {
    try {
      const { trackId } = req.body;

      let track = await getDailyTrack()
      if (track) {
        return res.status(500).json({ error: "Daily track already exists." });
      }

      track = new Track({ spotifyId: trackId });
      await track.save();
  
      res.status(201).json({ message: "Track created successfully", track });
    } catch(error) {
      // Log any error and send a failure response
      console.error("Error creating daily track:", error);
      res.status(500).json({ error: "Server Error. Could not create daily track." });
    }
  }

  // Fetch track created today
  static async getDailyTrack(req, res) {
    try {
      // Find track created today
      const track = await getDailyTrack(); // return plain js object

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
