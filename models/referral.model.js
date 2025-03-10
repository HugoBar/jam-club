const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    maxUse: { type: Number, required: true },
    used: { type: Number, required: true, default: 0 },
    claimedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("referral", referralSchema);
