const BookingService = require('../services/BookingService');

const ServiceService = require('../services/ServiceService');

const fetchAvailableTimes = async (req, res) => {
    try {
        const { date, serviceId } = req.query;
        if (!date || !serviceId) {
            return res.status(400).json({ error: "تاریخ و سرویس لازم است." });
        }
        const service = await ServiceService.getServiceById(serviceId);
        const slots = await BookingService.getAvailableSlots(date, service.duration);
        res.json({ slots });
    } catch (error) {
        if (error.message === 'SERVICE_NOT_FOUND') {
            return res.status(404).json({ error: "سرویس یافت نشد." });
        }
        if (error.message === 'INVALID_DATE' || error.message === 'INVALID_DURATION') {
            return res.status(400).json({ error: "ورودی نامعتبر." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const createBooking = async (req, res) => {
    try {
        const { customerName, phone, date, startTime, serviceId } = req.body;
        const result = await BookingService.createBooking({ customerName, phone, date, startTime, serviceId });
        res.status(200).json({ success: true, booking: result });
    } catch (error) {
        if (error.message === 'MISSING_FIELDS') {
            return res.status(400).json({ error: "تمام فیلدها الزامی است." });
        }
        if (error.message === 'INVALID_DATE') {
            return res.status(400).json({ error: "تاریخ نامعتبر است." });
        }
        if (error.message === 'SLOT_TAKEN') {
            return res.status(409).json({ error: "این زمان همین الان رزرو شد." });
        }
        if (error.message === 'SERVICE_NOT_FOUND') {
            return res.status(404).json({ error: "سرویس یافت نشد." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

module.exports = { fetchAvailableTimes, createBooking };
