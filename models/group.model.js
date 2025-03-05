const mongoose = require("mongoose");
const User = require("./user.model"); // Import the User model

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

groupSchema.pre("findOneAndDelete", async function (next) {
  const group = await this.model.findOne(this.getFilter()); // Get the group being deleted
  if (!group) return next();

  await User.updateMany(
    { groups: group._id },
    { $pull: { groups: group._id } } 
  );

  next();
});

module.exports = mongoose.model("Group", groupSchema);
