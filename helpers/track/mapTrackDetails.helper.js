const mapTrackDetails = (track, details) => {
  return {
    ...track,
    name: details.name,
    artists: details.artists.map((artist) => artist.name),
    externalUrls: details.external_urls,
  };
};

const mapTracksDetails = (tracks, details) => {
  return tracks.map((track) => {
    const trackDetails = details.find(({ id }) => id === track.spotifyId);
    if (trackDetails) {
      // Call mapTrackDetails for each track found in details
      return mapTrackDetails(track, trackDetails);
    }
    return track;
  });
};

module.exports = { mapTrackDetails, mapTracksDetails };
