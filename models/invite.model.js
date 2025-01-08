const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    inviter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    invitee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    status: {
      type: "string",
      enum: ["pending", "accepted", "declined", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

inviteSchema.index({ invitee: 1, group: 1 }, { unique: true });

module.exports = mongoose.model("Invite", inviteSchema);
