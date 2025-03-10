const Referral = require("../models/referral.model");

class ReferralController {
  static async addReferral(req, res) {
    try {
      const { code, maxUse } = req.body;
      const userId = req.userId;

      const referral = new Referral({
        code,
        user: userId,
        maxUse,
      });
      await referral.save();

      res
        .status(201)
        .json({ message: "Referral created succssfully:", referral });
    } catch (error) {
      console.error("Error creating referral:", error);
      res
        .status(500)
        .json({ error: "Server Error. Could not create referral." });
    }
  }
}

module.exports = ReferralController;
