const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/group.controller");
const RecommendationController = require("../controllers/recommendation.controller");
const verifyToken = require("../middlewares/auth.middleware");
const isValidStatus = require("../middlewares/isValidStatus.middleware");
const verifySpotifyToken = require("../middlewares/authSpotify.middleware");

// Create group
router.post("/", verifyToken, GroupController.addGroup);

// Get a group
router.get("/all", verifyToken, GroupController.getGroups);
router.get("/:id", verifyToken, GroupController.getGroupById);

// Add members to a group
router.get("/:id/invite", verifyToken, GroupController.getGroupInvites);
router.post("/:id/invite", verifyToken, GroupController.inviteById);
router.patch("/:id/invite/:inviteId/reject", verifyToken, isValidStatus, GroupController.rejectGroupInvite)
router.patch("/:id/invite/:inviteId/accept", verifyToken, isValidStatus, GroupController.acceptGroupInvite)
router.post("/:id/remove", verifyToken, GroupController.removeFromGroup);

// Member recommendations
router.get("/:id/recommendation", verifyToken, verifySpotifyToken, RecommendationController.getRecommendations);
router.get("/:id/recommendation/history", verifyToken, verifySpotifyToken, RecommendationController.getAllRecommendation);
router.post("/:id/recommendation", verifyToken, RecommendationController.addRecommendation);

module.exports = router;
