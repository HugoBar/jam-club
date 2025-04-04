const mapTrackDetails = (track, details) => {
  return {
    ...track,
    name: details.name,
    artists: details.artists.map((artist) => artist.name),
    externalUrls: {
      spotify: { url: details.external_urls.spotify, uri: details.uri },
    },
    cover: details.album.images,
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
