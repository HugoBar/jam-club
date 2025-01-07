const mongoose = require("mongoose");

// MongoDB connection string
const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.APP_NAME}?retryWrites=true&w=majority`;

// Function to connect to the MongoDB database
const connectDB = async () => {
  mongoose
    .connect(dbURL) // Attempt to connect to the database
    .then((result) => {
      console.log("Connected to MongoDB"); // Log a success message on successful connection
    })
    .catch((err) => {
      console.error("Could not connect to MongoDB:", err); // Log an error message if the connection fails
    });
};

module.exports = connectDB;
