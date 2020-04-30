const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('home page for home.js route');
});

module.exports = router;
