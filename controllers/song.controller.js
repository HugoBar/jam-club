const Song = require("../models/song.model");

class SongController {
  // Static method to handle adding a new song
  static async addSong(req, res) {
    const { title, artist } = req.body;

    const song = new Song({ title, artist });

    await song.save();

    // Respond with a success message and a 201 status code
    res.status(201).json({ message: "Song registered successfully" });
  }

  // Static method to fetch songs created today
  static async getSong(req, res) {
    try {
      // Set the start of the day to 00:00:00
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Set the end of the day to 23:59:59.999
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Find songs created today, using the start and end of the day as a range
      const song = await Song.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      // Respond with the list of songs created today
      res.status(200).json(song);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Server error. Could not fetch songs." });
    }
  }

  // Static method to fetch all songs
  static async getAllSongs(req, res) {
    try {
      const songs = await Song.find();

      // Respond with the list of all songs
      res.status(200).json(songs);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Server error. Could not fetch songs." });
    }
  }
}

module.exports = SongController;
