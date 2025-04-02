const User = require("../models/user.model");

async function isAdmin(req, res, next) {
	console.log(req.userId)
  const adminUser = await User.findOne({ _id: req.userId, role: "admin" });

	if(!adminUser) {
		return res.status(401).json({ error: "Access denied" });
	}

  next();
}

module.exports = isAdmin;
