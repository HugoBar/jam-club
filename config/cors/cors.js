const cors = require('cors');

require('dotenv').config();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

module.exports = cors(corsOptions);
