function isValidStatus(req, res, next) {
  const { status } = req.body;

  if (!["accepted", "declined", "canceled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  next();
}

module.exports = isValidStatus;
