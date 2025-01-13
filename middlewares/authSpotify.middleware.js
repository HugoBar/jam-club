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
      const { access_token: accessToken, token_type: tokenType, expires_in: expiresIn } = response;

      spotifyToken = tokenType + " " + accessToken;

      req.spotifyToken = spotifyToken;
      cache.set("spotifyToken", spotifyToken, expiresIn);

      console.log("Spotify token fetched with success");
    }

    next();
  } catch {
    res.status(403).send();
  }
}

module.exports = verifySpotifyToken;
