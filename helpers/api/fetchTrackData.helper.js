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

const fetchTracksDetails = async (ids, token) => {
  try {
    const response = await axios.get(url, {
      headers: { "Authorization": token, "Content-Type": "application/json" },
      params: { "ids": ids }
    });
    return response.data.tracks;
  } catch (error) {
    console.error("Error fetching track data:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchTrackDetails, fetchTracksDetails };
