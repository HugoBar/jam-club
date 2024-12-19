const express = require('express');
const router = express.Router();
const SongController = require('../controllers/song.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Handle the /songs endpoint
router.post('/', verifyToken, SongController.addSong);
router.get('/', verifyToken, SongController.getSong);

router.get('/all', verifyToken, SongController.getAllSongs);

// Add more routes for the /songs endpoint as needed

module.exports = router;