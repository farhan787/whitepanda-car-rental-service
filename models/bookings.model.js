const mongoose = require('mongoose');
const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const bookingsSchema = new mongoose.Schema({
  carId: {
    type: Object,
    required: true,
  },
  bookingSlots: {
    type: ['Mixed'],
    required: true,
  },
});

const Bookings = mongoose.model('Bookings', bookingsSchema);

function validateBookingSchema(reqBooking) {
  const schema = {
    carId: JoiObjectId().required(),
  };

  const options = {
    allowUnknown: true,
  };
  return Joi.validate(reqBooking, schema, options);
}

module.exports = {
  Bookings,
  validateBookingSchema,
};
