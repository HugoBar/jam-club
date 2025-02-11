const bcrypt = require("bcrypt"); // for hashing passwords
const User = require("../models/user.model");
const jwt = require("jsonwebtoken"); // for generating authentication tokens

class AuthController {
  // Static method to handle user registration
  static async register(req, res) {
    try {
      const { username, password, nickname } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ username, password: hashedPassword, nickname });

      await user.save();

      // Respond with a success message if the user is created successfully
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      // Log any error and send a failure response
      console.error("Error creating user:", error);

      // Duplicate key error
      if (error.code === 11000) {
        const keys = Object.keys(error.keyValue);
        if (keys.includes("username")) {
          return res.status(500).json({ error: "Username is already taken" });
        }
        else if (keys.includes("nickname")) {
          return res.status(500).json({ error: "Nickname is already taken" });
        }
      }

      res.status(500).json({ error: "Registration failed" });
    }
  }

  // Static method to handle user login
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      // If the user is not found, respond with an authentication failure message
      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      // If the passwords do not match, respond with an authentication failure message
      if (!passwordMatch) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      // If authentication is successful, generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "3h", // Token expires in 3 hour
      });

      // Respond with the generated token
      res.status(200).json({ token });
    } catch (error) {
      // Send a failure response if login fails
      res.status(500).json({ error: "Login failed" });
    }
  }
}

module.exports = AuthController;
