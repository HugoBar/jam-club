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
}

module.exports = UsersController;
