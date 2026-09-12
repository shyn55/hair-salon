const express = require('express');
const router = express.Router();
const {
    getStats, getTodayBookings, getAllBookings, updateBookingStatus, getRevenueReport
} = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/today', getTodayBookings);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/revenue', getRevenueReport);

module.exports = router;
