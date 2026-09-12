const BookingService = require('../services/BookingService');
const ServiceService = require('../services/ServiceService');
const StaffService = require('../services/StaffService');

const getPublicServices = async (req, res) => {
    try {
        const { gender } = req.query;
        const services = await ServiceService.getPublicServices(gender);
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const getPublicCategories = async (req, res) => {
    try {
        const categories = await ServiceService.getPublicCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const getAvailability = async (req, res) => {
    try {
        const { date, serviceId } = req.query;

        if (!date || !serviceId) {
            return res.status(400).json({ error: "تاریخ و سرویس لازم است." });
        }

        const service = await ServiceService.getServiceById(serviceId);
        const slots = await BookingService.getAvailableSlots(date, service.duration);
        res.status(200).json({ success: true, data: { slots, duration: service.duration } });
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

const getWorkingHours = async (req, res) => {
    try {
        const hours = await StaffService.getPublicWorkingHours();
        res.status(200).json({ success: true, data: hours });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const getDayStatus = async (req, res) => {
    try {
        const { date, serviceId } = req.query;
        if (!date) return res.status(400).json({ error: 'Date required' });

        let duration = 60;
        if (serviceId) {
            try {
                const service = await ServiceService.getServiceById(serviceId);
                if (service) duration = service.duration;
            } catch (e) {
                // Service not found — use default duration
            }
        }

        const status = await BookingService.getDayStatus(date, duration);
        res.json({ success: true, data: { date, status } });
    } catch (error) {
        if (error.message === 'INVALID_DATE') {
            return res.status(400).json({ error: 'تاریخ نامعتبر است.' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getPublicServices, getPublicCategories, getAvailability, getWorkingHours, getDayStatus };
