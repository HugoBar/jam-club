const jwt = require("jsonwebtoken");

// Function to verify the JWT token
async function verifyToken(req, res, next) {
  // Retrieve the token from the Authorization header
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader) {
    token = authHeader.split(" ")[1];
  }

  // If no token is provided, respond with a 401 Unauthorized status
  if (!token) {
    return res.status(401).json({ error: "Access token not provided" });
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    // If access token verification fails, check the refresh token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not provided" });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY
      );
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, iat: Math.floor(Date.now() / 1000) },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );

      // Set the new access token in the response header
      res.setHeader("new-access-token", `Bearer ${newAccessToken}`);

      // Attach the userId to the request object
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
  }
}

module.exports = verifyToken;
