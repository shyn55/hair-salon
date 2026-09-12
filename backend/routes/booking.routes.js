const express = require('express');
const router = express.Router();
const { fetchAvailableTimes, createBooking } = require('../controllers/booking.controller');

router.get('/available-times', fetchAvailableTimes);
router.post('/create', createBooking);

module.exports = router;
