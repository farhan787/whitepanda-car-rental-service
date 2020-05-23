const moment = require('moment');
const { Bookings } = require('../models/bookings.model');
const { Car, validateCarSchema } = require('../models/car.model');

exports.getCars = async(req, res) => {
  const cars = await Car.find();
  res.send(cars);
}

exports.addCar = async (req, res) => {
  const duplicateCarNumber = await Car.find({
    carNumber: req.body.carNumber,
  });

  if (duplicateCarNumber.length > 0) {
    return res.status(400).send({
      'Duplicate Error': `Car with number ${req.body.carNumber} already exist`,
    });
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
    message: 'Car added successfully',
  };
  return res.send(responseData);
};

exports.bookCar = async (req, res) => {
  const carId = req.body.carId;
  const rentalDays = req.body.rentalDays;
  if (!rentalDays) {
    return res
      .status(400)
      .send({ error: 'rentalDays missing in request body' });
  }

  const car = await Car.findById(carId);
  if (!car) {
    return res.status(404).send({ error: 'Car not found' });
  }

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

exports.findAvailableCars = async (req, res) => {
  const validFilters = ['date', 'companyName', 'year', 'seatingCapacity'];

  const filter = req.body.filter;
  const filterValue = req.body.filterValue;
  if (!validFilters.includes(filter)) {
    return res
      .status(400)
      .send({ Error: 'Invalid filter', validFilters: validFilters });
  }

  if (!filterValue) {
    return res
      .status(400)
      .send({ Error: 'filterValue is missing from request body' });
  }

  if (filter === 'date' || filter === 'time') {
    const availableCars = await Car.getAvailableCars(filterValue);
    return res.send(availableCars);
  }

  const query = {};
  query[filter] = filterValue;

  const cars = await Car.find(query).select('-_id -__v');
  return res.send(cars);
};

exports.getCarDetails = async (req, res) => {
  const carId = req.params.id;
  if (!carId) {
    return res
      .status(400)
      .send({ Error: 'carId is missing from request param' });
  }

  const carDetails = await Car.carDetails(carId);
  return res.send(carDetails);
};

exports.updateCar = async (req, res) => {
  const carId = req.params.id;
  if (!carId) {
    return res
      .status(400)
      .send({ Error: 'carId is missing from request param' });
  }

  const { error } = validateCarSchema(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const carIsBooked = await Car.isBooked(carId);
  if (carIsBooked) {
    return res
      .status(400)
      .send({ 'Response status': 'Can not update a booked car ' });
  }

  const updatedCar = await Car.findByIdAndUpdate(
    carId,
    {
      $set: {
        companyName: req.body.companyName,
        carNumber: req.body.carNumber,
        dailyRentalRate: req.body.dailyRentalRate,
        model: req.body.model,
        year: req.body.year,
        seatingCapacity: req.body.seatingCapacity,
      },
    },
    { new: true }
  );

  const resData = {
    updatedCar: updatedCar,
    message: 'Car updated successfully!',
  };
  return res.send(resData);
};

exports.deleteCar = async (req, res) => {
  const carId = req.params.id;
  if (!carId) {
    return res
      .status(400)
      .send({ Error: 'carId is missing from request param' });
  }

  const car = await Car.findById(carId);
  if (!car) {
    return res.status(404).send({
      'Not Found Error': `Car with carId ${carId} does not exist`,
    });
  }

  const carIsBooked = await Car.isBooked(carId);
  if (carIsBooked) {
    return res
      .status(400)
      .send({ 'Response status': 'Can not delete a booked car ' });
  }

  await Car.findByIdAndRemove(carId);

  const resData = {
    carInfo: car,
    message: 'Car deleted successfully!',
  };
  return res.send(resData);
};
