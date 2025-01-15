const Track = require("../models/track.model");
const { fetchTrackDetails } = require("../helpers/api/fetchTrackData.helper");

class TrackController {
  // Static method to handle adding a new track
  static async setDailyTrack(req, res) {
    const { track_id: trackId } = req.body;

    const track = new Track({ spotifyId: trackId });
    await track.save();

    res.status(201).json({ message: "Track created successfully", track });
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
      const track = await Track.findOne({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      }).lean(); // return plain js object

      const { name, artists, external_urls: externalUrls } = await fetchTrackDetails(
        track.spotifyId,
        req.spotifyToken
      );
      const artistsNames = artists.map((a) => a.name);

      const updatedTrack = {
        ...track,
        name,
        artistsNames,
        externalUrls,
      };
      
      // Respond with the list of track created today
      res.status(200).json(updatedTrack);
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
      res
        .status(500)
        .json({ message: "Server error. Could not fetch tracks." });
    }
  }
}

module.exports = TrackController;
