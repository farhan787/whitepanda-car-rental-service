const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  model: {
    type: Number,
    required: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
