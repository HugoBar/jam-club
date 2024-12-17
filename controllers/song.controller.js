const Song = require("../models/song.model");

class SongController {
  static async addSong(req, res) {
    const { title, artist } = req.body;

    const song = new Song({ title, artist });

    await song.save();
    res.status(201).json({ message: "Song registered successfully" });
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
