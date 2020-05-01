const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('White Panda Car Rental Services');
});

module.exports = router;
