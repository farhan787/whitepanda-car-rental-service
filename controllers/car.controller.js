const moment = require('moment');
const { Bookings, validateBookingSchema } = require('../models/bookings.model');
const { Car, validateCarSchema } = require('../models/car.model');

exports.addCar = async (req, res) => {
  const { err } = validateCarSchema(req.body);
  if (err) {
    return res.status(400).send(err);
  }

  const car = new Car({
    carNumber: req.body.carNumber,
    companyName: req.body.companyName,
    dailyRentalRate: req.body.dailyRentalRate,
    model: req.body.model,
    year: req.body.year,
    seatingCapacity: req.body.seatingCapacity,
  });

  await car.save();
  const responseData = {
    carInfo: car,
    message: 'Car saved successfully',
  };
  res.send(responseData);
};

exports.bookCar = async (req, res) => {
  const { err } = validateBookingSchema(req.body);
  if (err) {
    return res.status(400).send(err);
  }

  const carId = req.body.carId;
  const rentalDays = req.body.rentalDays;

  const car = await Car.findById(carId);
  if (!car) res.status(404).send('Car not found');

  const existingBooking = await Bookings.findOne({
    carId: carId,
  });

  const { bookingStartTime, bookingEndTime } = car.getNextBookingSlot(
    rentalDays,
    existingBooking
  );

  const bookingSlots = {
    bookingStartTime,
    bookingEndTime,
  };

  const newBooking = new Bookings({
    carId: carId,
    bookingSlots: bookingSlots,
  });

  const resData = {
    carInfo: car,
    message: `Car successfully booked for ${rentalDays} days starting from ${moment(
      bookingStartTime
    ).format('DD-MM-YYYY')} to ${moment(bookingEndTime).format('DD-MM-YYYY')}`,
  };

  if (existingBooking) {
    existingBooking.bookingSlots.push(bookingSlots);

    await existingBooking.save();
    return res.send(resData);
  }

  newBooking.markModified(bookingSlots);
  await newBooking.save();
  res.send(resData);
};

// // show availabe cars, based on date, time, seating capacity or other filters
// router.post('/availableCars', CarController.findAvailableCars);

// // Using only car model
// // show the details of a particular car and its currently active booking
// router.post('/carDetails/:carNumber', CarController.getCarDetails);

// // update/delete a car only if it's not booked
// router.update('/updateCar', CarController.updateCar);
// router.delete('/deleteCar', CarController.deleteCar);
