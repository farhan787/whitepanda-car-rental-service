const express = require('express');

const home = require('../routes/home');
const cars = require('../routes/cars');

module.exports = function (app) {
  app.use(express.json());
  app.use('/', home);
  app.use('/api/cars', cars);
};
