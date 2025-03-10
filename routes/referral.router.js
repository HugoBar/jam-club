const express = require("express");
const router = express.Router();
const ReferralController = require("../controllers/referral.controller");
const verifyToken = require("../middlewares/auth.middleware");

// Referral
router.post("/", verifyToken, ReferralController.addReferral);

module.exports = router;
