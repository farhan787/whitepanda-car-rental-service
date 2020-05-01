const winston = require('winston');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

require('express-async-errors');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

const server = app.listen(
  PORT,
  winston.info(`Server listening on port ${PORT}`)
);

module.exports = server;
