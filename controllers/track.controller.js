const Track = require("../models/track.model");
const { fetchTrackDetails } = require("../helpers/api/fetchTrackData.helper");
const { mapTrackDetails, mapTracksDetails } = require("../helpers/track/mapTrackDetails.helper");
const { getDailyTrack, getDailyTrackByDate } = require("../helpers/track/track.helper")
const { isValidDate } = require("../helpers/date.helper");
const { spotifySearchTrack } = require("../helpers/api/spotifySearchTrack.helper");

class TrackController {
  // Create a new track
  static async setDailyTrack(req, res) {
    try {
      const { trackId, day, month, year } = req.body;
      let date

      if (isValidDate(year, month, day) ) {
        date = new Date(year, month - 1, day);
      }
      else if (year === undefined && month === undefined && day === undefined) {
        date = new Date();
      }
      else {
        return res.status(400).json({ error: "Invalid date." });
      }

      let track = await getDailyTrackByDate(date);
      if (track) {
        return res.status(500).json({ error: "Daily track already exists." });
      }

      track = new Track({ spotifyId: trackId, date });
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

  // Search for a track using the Spotify API
  static async searchTrack(req, res) {
    const { keyword, type, limit, offset } = req.query;

    try {
      const searchResults = await spotifySearchTrack({keyword, type, limit, offset, token: req.spotifyToken})

      const mappedResults = searchResults.tracks.items.map((track) => {
        return {
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          externalUrls: track.external_urls,
          cover: track.album.images
        };
      });
      
      res.status(200).json(mappedResults);
    } catch (error) {
      console.error("Error searching track:", error);
      res.status(500).json({ message: "Server error. Could not search track." });
    }
  }
}

module.exports = TrackController;
