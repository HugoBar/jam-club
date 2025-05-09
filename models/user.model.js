const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickname: { type: String, unique: true, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    role: { type: String, enum: ["admin", "user"], default: "user", required: true},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
