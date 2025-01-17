// Middleware function to validate the status field in the request body
function isValidStatus(req, res, next) {
  const { status } = req.body;

  // Check if the 'status' is one of the valid values: 'accepted', 'declined', or 'canceled'
  if (!["accepted", "declined", "canceled"].includes(status)) {
    // If the status is not valid, respond with a 400 Bad Request status and an error message
    return res.status(400).json({ message: "Invalid status" });
  }

  // If the status is valid, pass the request to the next middleware or route handler
  next();
}

module.exports = isValidStatus;
