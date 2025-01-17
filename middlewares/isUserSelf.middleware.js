// Middleware function to check if the logged-in user is trying to access their own data
function isUserSelf(req, res, next) {
  // Check if the logged-in user is trying to access their own data
  if (req.userId != req.params.id)
    // If the user IDs do not match, respond with a 401 Unauthorized status and an error message
    return res.status(401).json({ error: "Access denied" });

  // If the user IDs match, allow the request to proceed to the next middleware or route handler
  next();
}

module.exports = isUserSelf;
