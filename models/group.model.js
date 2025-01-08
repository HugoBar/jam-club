const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("group", groupSchema);
