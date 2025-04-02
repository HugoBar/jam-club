const express = require("express");
const router = express.Router();
const TrackController = require("../controllers/track.controller");
const verifyToken = require("../middlewares/auth.middleware");
const verifySpotifyToken = require("../middlewares/authSpotify.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

// Create track
router.post("/", verifyToken, isAdmin, TrackController.setDailyTrack);

// Get track
router.get("/", verifyToken, verifySpotifyToken, TrackController.getDailyTrack);
router.get("/all", verifyToken, TrackController.getAllTracks);

// Search track
router.get("/search", verifyToken, verifySpotifyToken, TrackController.searchTrack);

module.exports = router;
