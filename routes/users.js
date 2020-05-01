const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.post('/addUser', UserController.addUser);

module.exports = router;
