const express = require("express");
const router = express.Router();
const TrackController = require("../controllers/track.controller");
const verifyToken = require("../middlewares/auth.middleware");
const verifySpotifyToken = require("../middlewares/authSpotify.middleware");

// Add a new track
router.post("/", verifyToken, verifySpotifyToken, TrackController.setDailyTrack);

// Get a track
router.get("/", verifyToken, TrackController.getDailyTrack);

// Get all tracks
router.get("/all", verifyToken, TrackController.getAllTracks);

module.exports = router;
