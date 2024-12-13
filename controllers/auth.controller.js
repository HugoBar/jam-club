const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

class AuthController {
	static async register(req, res) {
		try {
				const { username, password, nickname } = req.body;
				const hashedPassword = await bcrypt.hash(password, 10);
		
				const user = new User({ username, password: hashedPassword, nickname });
		
				await user.save();
				res.status(201).json({ message: "User registered successfully" });
			} catch (error) {
				console.log(error)
				res.status(500).json({ error: "Registration failed" });
			}
	}

	static async login(req, res) {
		try {
				const { username, password } = req.body;
				const user = await User.findOne({ username });
		
				if (!user) {
					return res.status(401).json({ error: "Authentication failed" });
				}
		
				const passwordMatch = await bcrypt.compare(password, user.password);
		
				if (!passwordMatch) {
					return res.status(401).json({ error: "Authentication failed" });
				}
		
				const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
					expiresIn: "1h",
				});
		
				res.status(200).json({ token });
			} catch (error) {
				res.status(500).json({ error: "Login failed" });
			}
	}
}

module.exports = AuthController;