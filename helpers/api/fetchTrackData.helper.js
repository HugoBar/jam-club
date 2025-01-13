const axios = require("axios");
const url = "https://api.spotify.com/v1/tracks/";

const fetchTrackData = async (id, token) => {
  try {
    const response = await axios.get(url + id, {
      headers: { "Authorization": token },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching track data:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchTrackData };
