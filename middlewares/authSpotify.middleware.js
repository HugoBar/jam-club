const cache = require("../config/cache/cache");
const { requestSpotifyToken } = require("../helpers/api/spotifyToken.helper");

async function verifySpotifyToken(req, res, next) {
  try {
    // Check if the data exists in the cache
    const cachedToken = cache.get("spotifyToken");

    if (cachedToken) {
      req.spotifyToken = cachedToken;
      console.log("Spotify token fetched with success");
    } else {
      const response = await requestSpotifyToken();
      const { access_token, token_type, expires_in } = response;

      spotifyToken = token_type + " " + access_token;

      req.spotifyToken = spotifyToken;
      cache.set("spotifyToken", spotifyToken, expires_in);

      console.log("Spotify token fetched with success");
    }

    next();
  } catch {
    res.status(403).send();
  }
}

module.exports = verifySpotifyToken;
