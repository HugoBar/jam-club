function isUserSelf(req, res, next) {
  // Check if the logged-in user is trying to access their own data
  if (req.userId != req.params.id)
    return res.status(401).json({ error: "Access denied" });

  next();
}

module.exports = isUserSelf;
