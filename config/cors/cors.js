const cors = require('cors');

require('dotenv').config();

const corsOptions = {
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

module.exports = cors(corsOptions);
