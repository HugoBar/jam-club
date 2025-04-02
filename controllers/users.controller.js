const User = require("../models/user.model");
const Invite = require("../models/invite.model");
const bcrypt = require("bcrypt");
const { validatePassword } = require("../helpers/auth/validateFields");

class UsersController {
  // Fetch user by id
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error. Could not fetch user." });
    }
  }
  // Fetch all users
  static async getUsers(req, res) {
    try {
      const users = await User.find();

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Update user information
  static async updateUserInfo(req, res) {
    try {
      const userId = req.params.id;
      const { fields } = req.body;

      delete fields.password;

      const user = await User.findOneAndUpdate({ _id: userId }, fields, {
        new: true,
      });

      user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Update user password
  static async updateUserPasswordById(req, res) {
    try {
      const userId = req.params.id;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ message: "Password does not match" });
      }

      try {
        validatePassword(newPassword);
      } catch (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.updateOne({ password: hashedPassword });

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating user password:", error);
      return res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async updateUserPasswordByUsername(req, res) {
    try {
      const { username, currentPassword, newPassword } = req.body;
      console.log(currentPassword)
      console.log(newPassword)
      const user = await User.findOne({ username });
      console.log(user.password)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ message: "Password does not match" });
      }

      try {
        validatePassword(newPassword);
      } catch (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.updateOne({ password: hashedPassword });

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating user password:", error);
      return res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  // Fetch invites sent by the user
  static async getUserInvitesSent(req, res) {
    try {
      const userId = req.params.id;

      const invites = await Invite.find({ inviter: userId });

      res.status(200).json(invites);
    } catch (error) {
      console.error("Error fetching invites:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Fetch invites received by the user
  static async getUserInvitesReceived(req, res) {
    try {
      const userId = req.params.id;

      const invites = await Invite.find({ invitee: userId }).populate("group");

      res.status(200).json(invites);
    } catch (error) {
      console.error("Error fetching invites:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = UsersController;
