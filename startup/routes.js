const express = require('express');
const error = require('../middleware/error');

const auth = require('../routes/auth');
const cars = require('../routes/cars');
const home = require('../routes/home');
const users = require('../routes/users');

module.exports = function (app) {
  app.use(express.json());
  app.use('/', home);
  app.use('/api/auth', auth);
  app.use('/api/cars', cars);
  app.use('/api/users', users);
  app.use(error);
};
