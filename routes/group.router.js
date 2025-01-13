const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/group.controller");
const RecommendationController = require("../controllers/recommendation.controller");
const verifyToken = require("../middlewares/auth.middleware");
const isValidStatus = require("../middlewares/isValidStatus.middleware");
const verifySpotifyToken = require("../middlewares/authSpotify.middleware");

// Add a new group
router.post("/", verifyToken, GroupController.addGroup);

// Get a group by its ID
router.get("/all", verifyToken, GroupController.getGroups);
router.get("/:id", verifyToken, GroupController.getGroupById);

// Add members to a group
router.get("/:id/invite", verifyToken, GroupController.getGroupInvites);
router.post("/:id/invite", verifyToken, GroupController.inviteById);
router.patch("/:id/invite/:inviteId/reject", verifyToken, isValidStatus, GroupController.rejectGroupInvite)
router.patch("/:id/invite/:inviteId/accept", verifyToken, isValidStatus, GroupController.acceptGroupInvite)
router.post("/:id/remove", verifyToken, GroupController.removeFromGroup);

// Member recommendations
router.post("/:id/recommendation", verifyToken, RecommendationController.addRecommendation);
router.post("/:id/recommendation", verifyToken, verifySpotifyToken, RecommendationController.addRecommendation);

module.exports = router;
