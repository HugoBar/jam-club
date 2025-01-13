const axios = require("axios");
const url = "https://accounts.spotify.com/api/token";

const requestSpotifyToken = async () => {
  try {
    const response = await axios.post(
      url,
      {
        grant_type: "client_credentials",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching Spotify token:", error.message);
  }
};

module.exports = { requestSpotifyToken };
