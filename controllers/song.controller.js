const Song = require("../models/song.model");

class SongController {
  static async addSong(req, res) {
    const { title, artist } = req.body;

    const song = new Song({ title, artist });

    await song.save();
    res.status(201).json({ message: "Song registered successfully" });
  }

  static async getSong(req, res) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const song = await Song.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      res.status(200).json(song);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Server error. Could not fetch songs." });
    }
  }

  static async getAllSongs(req, res) {
    try {
      const songs = await Song.find();
      res.status(200).json(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Server error. Could not fetch songs." });
    }
  }
}

module.exports = SongController;
