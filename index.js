const express = require('express');
const router = express.Router();
const app = express();
require('dotenv').config()

app.use(express.json());

const mongoose = require('mongoose');

const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`

mongoose
  .connect(dbURL)
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(process.env.DB_PORT, () => {
      console.log('Server started on port ***');
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
  });

const songRouter = require('./routes/song.router');
const authRouter = require('./routes/auth.router');

app.use('/auth', authRouter);
app.use('/songs', songRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});