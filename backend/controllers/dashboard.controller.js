const DashboardService = require('../services/DashboardService');

const getStats = async (req, res) => {
    try {
        const stats = await DashboardService.getStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const getTodayBookings = async (req, res) => {
    try {
        const bookings = await DashboardService.getTodayBookings();
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const { page, limit, status, date } = req.query;
        const result = await DashboardService.getAllBookings({ page, limit, status, date });
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = await DashboardService.updateBookingStatus(id, status);
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        if (error.message === 'INVALID_STATUS') {
            return res.status(400).json({ error: "وضعیت نامعتبر است." });
        }
        if (error.code === 'P2025') return res.status(404).json({ error: "رزرو یافت نشد." });
        res.status(500).json({ error: "خطای سرور" });
    }
};

const getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const report = await DashboardService.getRevenueReport({ startDate, endDate });
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

module.exports = { getStats, getTodayBookings, getAllBookings, updateBookingStatus, getRevenueReport };
