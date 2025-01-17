const cache = require("../config/cache/cache");
const { requestSpotifyToken } = require("../helpers/api/spotifyToken.helper");

async function verifySpotifyToken(req, res, next) {
  try {
    // Check if the data exists in the cache
    const cachedToken = cache.get("spotifyToken");

    // If a cached token exists, use it
    if (cachedToken) {
      req.spotifyToken = cachedToken; // Attach the token to the request object
      console.log("Spotify token fetched with success");
    } else {
      // If no cached token, fetch a new one from Spotify API
      const response = await requestSpotifyToken();
      const {
        access_token: accessToken,
        token_type: tokenType,
        expires_in: expiresIn,
      } = response;

      // Construct the complete token (Bearer token format)
      spotifyToken = tokenType + " " + accessToken;

      // Attach the newly fetched token to the request object
      req.spotifyToken = spotifyToken; 

      // Cache the new token for future requests
      cache.set("spotifyToken", spotifyToken, expiresIn);

      console.log("Spotify token fetched with success");
    }

    next();
  } catch {
    res.status(403).send();
  }
}

module.exports = verifySpotifyToken;
