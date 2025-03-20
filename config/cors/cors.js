const cors = require('cors');

require('dotenv').config();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  exposedHeaders: 'new-access-token'
};

module.exports = cors(corsOptions);
