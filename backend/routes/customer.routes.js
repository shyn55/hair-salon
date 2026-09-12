const express = require('express');
const router = express.Router();
const { getPublicServices, getPublicCategories, getAvailability, getWorkingHours, getDayStatus } = require('../controllers/customer.controller');

router.get('/services', getPublicServices);
router.get('/categories', getPublicCategories);
router.get('/availability', getAvailability);
router.get('/working-hours', getWorkingHours);
router.get('/day-status', getDayStatus);

module.exports = router;
