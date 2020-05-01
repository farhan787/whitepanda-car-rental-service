const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');

const { Bookings } = require('./bookings.model');

const carSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  carNumber: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
});

carSchema.methods.getNextBookingSlot = function (rentalDays, booking) {
  if (booking) {
    const lastBooking = booking.bookingSlots[booking.bookingSlots.length - 1];
    let startTime = moment(lastBooking.bookingEndTime).add(1, 'd').format();
    let endTime = moment(startTime).add(rentalDays, 'd').format();

    return { bookingStartTime: startTime, bookingEndTime: endTime };
  }

  let startTime = moment().format();
  let endTime = moment(startTime).add(rentalDays, 'd').format();
  return { bookingStartTime: startTime, bookingEndTime: endTime };
};

carSchema.statics.carDetails = async function (carId) {
  const car = await this.findById(carId);
  const bookings = await Bookings.find({ carId: carId }).select('-carId');

  const details = { car, bookings };
  return details;
};

carSchema.statics.isBooked = async function (carId) {
  const bookings = await Bookings.find({ carId: carId }).select('-carId');
  if (bookings.length > 0) {
    return true;
  }
  return false;
};

const Car = mongoose.model('Car', carSchema);

function validateCarSchema(reqCar) {
  const schema = {
    companyName: Joi.string().max(50),
    carNumber: Joi.string().max(20).required(),
    dailyRentalRate: Joi.number().required(),
    model: Joi.string().max(30).required(),
    year: Joi.number().required(),
    seatingCapacity: Joi.number().max(20).required(),
  };

  return Joi.validate(reqCar, schema);
}

module.exports = {
  Car,
  validateCarSchema,
};
