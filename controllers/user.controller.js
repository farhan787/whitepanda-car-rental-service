const bcrypt = require('bcrypt');
const _ = require('lodash');

const { User, validateUser } = require('../models/user.model');

exports.addUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  let user = await User.findOne({ email: email });
  if (user) return res.status(400).send(`User with ${email} already exists`);

  user = new User({
    name,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header('auth-token', token).send({
    userInfo: _.pick(user, ['_id', 'name', 'email']),
    message: 'User sign up was successful',
  });
};
