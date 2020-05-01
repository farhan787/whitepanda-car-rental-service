const moment = require('moment');
const { Bookings } = require('../models/bookings.model');
const { Car } = require('../models/car.model');

exports.addCar = async (req, res) => {
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
    message: 'Car added successfully',
  };
  res.send(responseData);
};

exports.bookCar = async (req, res) => {
  const carId = req.body.carId;
  const rentalDays = req.body.rentalDays;
  if (!rentalDays) {
    res.status(400).send({ error: 'rentalDays missing in request body' });
  }

  const car = await Car.findById(carId);
  if (!car) res.status(404).send({ error: 'Car not found' });

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
    rentalDays: rentalDays,
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
