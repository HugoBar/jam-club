const Track = require("../../models/track.model");

const getDailyTrack = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return Track.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
  });
};

const getDailyTrackByDate = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return Track.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
  });
};

module.exports = { getDailyTrack, getDailyTrackByDate };
