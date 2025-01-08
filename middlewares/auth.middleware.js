const jwt = require("jsonwebtoken");

// Function to verify the JWT token
function verifyToken(req, res, next) {
  // Retrieve the token from the "Authorization" header
  const token = req.header("Authorization");

  // If no token is provided, respond with a 401 Unauthorized status
  if (!token) return res.status(401).send()

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the userId to the request object
    req.userId = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, respond with a 401 Unauthorized status
    res.status(401).send()
  }
}

module.exports = verifyToken;
