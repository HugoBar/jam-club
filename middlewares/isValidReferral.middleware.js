const Referral = require("../models/referral.model");
const phaseOne = true;

async function isValidReferral(req, res, next) {
  if (!phaseOne) {
    return next();
  }

  const { referralCode } = req.body;

  const referral = await Referral.findOne({ code: referralCode });

  if (!referral || referral.used >= referral.maxUse) {
    return res.status(401).json({ error: "Invalid referral code" });
  }

  req.referral = referral;
  next();
}

module.exports = isValidReferral;
