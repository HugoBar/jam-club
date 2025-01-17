const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/auth.middleware");
const isUserSelf = require("../middlewares/isUserSelf.middleware");

// User
router.get("/all", verifyToken, UsersController.getUsers);
router.get("/:id", verifyToken, isUserSelf, UsersController.getUserById);
router.patch("/:id", verifyToken, isUserSelf, UsersController.updateUserInfo)


module.exports = router;
