const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/auth.middleware");
const isUserSelf = require("../middlewares/isUserSelf.middleware");

// User
router.get("/all", verifyToken, UsersController.getUsers);
router.patch("/password", UsersController.updateUserPasswordByUsername)

router.get("/:id", verifyToken, isUserSelf, UsersController.getUserById);
router.patch("/:id", verifyToken, isUserSelf, UsersController.updateUserInfo)
router.patch("/:id/password", verifyToken, isUserSelf, UsersController.updateUserPasswordById)

// User Invites
router.get("/:id/invites/sent", verifyToken, isUserSelf, UsersController.getUserInvitesSent);
router.get("/:id/invites/recieved", verifyToken, isUserSelf, UsersController.getUserInvitesReceived);

module.exports = router;
