const express = require('express');
const router = express.Router();

const CarController = require('../controllers/car.controller');

// add a new car
router.post('/addCar', CarController.addCar);

// book a specified car on its availability. A car can have multiple bookings
router.post('/bookCar', CarController.bookCar);

// show availabe cars, based on date, time, seating capacity or other filters
// router.post('/availableCars', CarController.findAvailableCars);

// Using only car model
// show the details of a particular car and its currently active booking
// router.post('/carDetails/:carNumber', CarController.getCarDetails);

// update/delete a car only if it's not booked
// router.update('/updateCar', CarController.updateCar);
// router.delete('/deleteCar', CarController.deleteCar);

module.exports = router;
