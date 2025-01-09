const User = require("../models/user.model");

class UsersController {
  // Static method to fetch user by id
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;

      // Find user
      const user = await User.findById(userId);

      // Respond with the user
      res.status(200).json(user);
    } catch (error) {
      // Log any errors and respond with a 500 error if something goes wrong
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error. Could not fetch user." });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await User.find();

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = UsersController;
