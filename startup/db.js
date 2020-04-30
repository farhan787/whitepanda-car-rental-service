const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
  const db = config.get('db');
  mongoose
    .connect(db)
    .then(() => winston.info(`Connected to ${db}`))
    .catch((err) => {
      winston.info('DB connection failed');
      winston.info(err);
    });
};
