const express = require("express");
const router = express.Router();
const SongController = require("../controllers/song.controller");
const verifyToken = require("../middlewares/auth.middleware");

// Add a new song
router.post("/", verifyToken, SongController.addSong);

// Get a song
router.get("/", verifyToken, SongController.getSong);

// Get all songs
router.get("/all", verifyToken, SongController.getAllSongs);

module.exports = router;
