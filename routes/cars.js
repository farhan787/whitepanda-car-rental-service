const express = require('express');
const router = express.Router();

const Car = require('../models/cars');

router.get('/', async (req, res) => {
  res.send('cars api page');
});

module.exports = router;
