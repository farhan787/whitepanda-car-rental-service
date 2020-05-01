const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');

const { User } = require('../models/user.model');
const validate = require('../middleware/validator');

router.post('/', validate(validateAuth), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ Error: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send({ Error: 'Invalid email or password' });
  }

  const token = user.generateAuthToken();
  res.send({
    'auth-token': token,
    message: 'Login successful!!',
  });
});

function validateAuth(reqAuth) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  };
  return Joi.validate(reqAuth, schema);
}

module.exports = router;
