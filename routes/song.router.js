const express = require('express');
const router = express.Router();
const SongController = require('../controllers/song.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Handle the /songs endpoint
router.get('/', authMiddleware.authenticate, SongController.getAllSongs);

// Add more routes for the /songs endpoint as needed

module.exports = router;