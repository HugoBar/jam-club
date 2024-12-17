const mongoose = require("mongoose")

const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.APP_NAME}?retryWrites=true&w=majority`

const connectDB = async () => {
  mongoose
    .connect(dbURL)
    .then((result) => {
      console.log("Connected to MongoDB")
    })
    .catch((err) => {
      console.error("Could not connect to MongoDB:", err)
    })
}

module.exports = connectDB
