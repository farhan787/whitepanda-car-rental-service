const express = require('express');
const error = require('../middleware/error');

const home = require('../routes/home');
const cars = require('../routes/cars');

module.exports = function (app) {
  app.use(express.json());
  app.use('/', home);
  app.use('/api/cars', cars);
  app.use(error);
};
