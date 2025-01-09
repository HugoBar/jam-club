const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/group.controller");
const verifyToken = require("../middlewares/auth.middleware");

// Add a new group
router.post("/", verifyToken, GroupController.addGroup);

// Get a group by its ID
router.get("/all", verifyToken, GroupController.getGroups);
router.get("/:id", verifyToken, GroupController.getGroupById);

// Add members to a group
router.post("/:id/invite", verifyToken, GroupController.inviteById);
router.patch("/:id/invite/:inviteeId", verifyToken, GroupController.updateInviteStatus)
router.post("/:id/remove", verifyToken, GroupController.removeFromGroup);

module.exports = router;
