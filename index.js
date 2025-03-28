const express = require("express");
const router = express.Router();
const app = express();
const corsConfig = require("./config/cors/cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use CORS configuration
app.use(corsConfig);

// Enable reading cookies
app.use(cookieParser()); 

// Import and connect to the database
const connectDB = require("./database/database");
connectDB();

// Import route modules
const authRouter = require("./routes/auth.router");
const usersRouter = require("./routes/users.router");
const trackRouter = require("./routes/track.router");
const groupRouter = require("./routes/group.router");
const referralRouter = require("./routes/referral.router");

// Define the routes for the application
// Authentication
app.use("/auth", authRouter);

// Users
app.use("/users", usersRouter)

// Daily tracks
app.use("/track", trackRouter);

// Groups
app.use("/group", groupRouter);

// Referrals
app.use("/referral", referralRouter);

// Handle requests to undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const port = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
