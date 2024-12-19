const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendation.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Handle the /recommendation endpoint
router.post('/', verifyToken, RecommendationController.addRecommendation);
router.get('/', verifyToken, RecommendationController.getRecommendation);

router.get('/all', verifyToken, RecommendationController.getAllRecommendations);

// Add more routes for the /recommendations endpoint as needed

module.exports = router;