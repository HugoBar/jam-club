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

      const referral = req.referral;
      referral
        .updateOne({
          $inc: { used: 1 },
          $push: {
            claimedBy: user._id,
          },
        }).exec();
    } catch (error) {
      // Log any error and send a failure response
      console.error("Error creating user:", error);

      // Duplicate key error
      if (error.code === 11000) {
        const keys = Object.keys(error.keyValue);
        if (keys.includes("username")) {
          return res.status(500).json({ error: "Username is already taken" });
        } else if (keys.includes("nickname")) {
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

      const accessToken = jwt.sign(
        { userId: user.id, iat: Math.floor(Date.now() / 1000) },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "10s", // Access token expires in 15 minutes
        }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
          expiresIn: "7d", // Refresh token expires in 7 days
        }
      );

      console.log("refreshToken controller", refreshToken);
      // Set refresh token in HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      console.log("refreshToken cookie", res.cookies.refreshToken);

      // Respond with the generated token
      res
        .status(200)
        .json({ accessToken, userId: user.id, message: "Login successful" });
    } catch (error) {
      // Send a failure response if login fails
      res.status(500).json({ error: "Login failed" });
    }
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not found" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY
      );
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({ error: "Invalid refresh token" });
    }
  }
}

module.exports = AuthController;
