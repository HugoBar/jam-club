const axios = require("axios");
const url = "https://api.spotify.com/v1/search";

const spotifySearchTrack = async ({keyword, type = "track,artist", limit = 5, offset = 0, token}) => {
  try {
    const response = await axios.get(
      url,
      {
        params: { q: keyword, type, limit, offset },
        headers: { "Authorization": token }}
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error.message);
  }
};

module.exports = { spotifySearchTrack };
