const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const isValidReferral = require("../middlewares/isValidReferral.middleware");

// User registration
router.post("/register", isValidReferral, AuthController.register);

// User login
router.post("/login", AuthController.login);

// Refresh token
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
