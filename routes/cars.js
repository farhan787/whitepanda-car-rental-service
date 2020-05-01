const express = require('express');
const router = express.Router();

const validate = require('../middleware/validator');
const validateObjectId = require('../middleware/validateObjectId');

const { validateBookingSchema } = require('../models/bookings.model');
const { validateCarSchema } = require('../models/car.model');

const CarController = require('../controllers/car.controller');

router.post('/addCar', validate(validateCarSchema), CarController.addCar);

router.post('/bookCar', validate(validateBookingSchema), CarController.bookCar);

router.post('/availableCars', CarController.findAvailableCars);

router.get('/carDetails/:id', validateObjectId, CarController.getCarDetails);

router.put('/updateCar/:id', validateObjectId, CarController.updateCar);

router.delete('/deleteCar/:id', validateObjectId, CarController.deleteCar);

module.exports = router;
