const express = require("express");
const router = express.Router();
const RecommendationController = require("../controllers/recommendation.controller");
const verifyToken = require("../middlewares/auth.middleware");

// Add a new recommendation
router.post("/", verifyToken, RecommendationController.addRecommendation);

// Get a user's recommendation
router.get("/", verifyToken, RecommendationController.getRecommendation);

// Get all recommendations
router.get("/all", verifyToken, RecommendationController.getAllRecommendations);

module.exports = router;
