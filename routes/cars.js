const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const validateObjectId = require('../middleware/validateObjectId');

const { validateBookingSchema } = require('../models/bookings.model');
const { validateCarSchema } = require('../models/car.model');

const CarController = require('../controllers/car.controller');

router.post(
  '/addCar',
  [auth, validate(validateCarSchema)],
  CarController.addCar
);

router.post('/bookCar', validate(validateBookingSchema), CarController.bookCar);

router.post('/availableCars', auth, CarController.findAvailableCars);

router.get('/carDetails/:id', validateObjectId, CarController.getCarDetails);

router.put('/updateCar/:id', [auth, validateObjectId], CarController.updateCar);

router.delete(
  '/deleteCar/:id',
  [auth, validateObjectId],
  CarController.deleteCar
);

router.get('/getCars', CarController.getCars);

module.exports = router;
