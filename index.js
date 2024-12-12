const express = require('express');
const router = express.Router();
const app = express();

// Middleware and routes will be added here
const songRouter = require('./routes/song.router');

app.use('/songs', songRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});