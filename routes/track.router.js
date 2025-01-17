const express = require("express");
const router = express.Router();
const TrackController = require("../controllers/track.controller");
const verifyToken = require("../middlewares/auth.middleware");
const verifySpotifyToken = require("../middlewares/authSpotify.middleware");

// Create track
router.post("/", verifyToken, TrackController.setDailyTrack);

// Get track
router.get("/", verifyToken, verifySpotifyToken, TrackController.getDailyTrack);
router.get("/all", verifyToken, TrackController.getAllTracks);

module.exports = router;
