const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/auth.middleware");
const isUserSelf = require("../middlewares/isUserSelf.middleware");

// User registration
router.get("/:id", verifyToken, isUserSelf, UsersController.getUserById);

module.exports = router;
