const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

// User registration
router.post("/register", AuthController.register);

// User login
router.post("/login", AuthController.login);

// Refresh token
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
