const StaffService = require('../services/StaffService');

const getWorkingHours = async (req, res) => {
    try {
        const hours = await StaffService.getWorkingHours();
        res.status(200).json({ success: true, data: hours });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const updateWorkingHours = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, isClosed } = req.body;
        const hours = await StaffService.updateWorkingHours(id, { startTime, endTime, isClosed });
        res.status(200).json({ success: true, data: hours });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: "ساعات کاری یافت نشد." });
        res.status(500).json({ error: "خطای سرور" });
    }
};

const bulkUpdateWorkingHours = async (req, res) => {
    try {
        const { schedule } = req.body;
        const results = await StaffService.bulkUpdateWorkingHours(schedule);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        if (error.message === 'SCHEDULE_ARRAY_REQUIRED') {
            return res.status(400).json({ error: "لیست برنامه کاری لازم است." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const addBreak = async (req, res) => {
    try {
        const { workingHoursId, startTime, endTime } = req.body;
        const breakEntry = await StaffService.addBreak({ workingHoursId, startTime, endTime });
        res.status(201).json({ success: true, data: breakEntry });
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ error: "ساعات کاری، شروع و پایان استراحت لازم است." });
        }
        if (error.message === 'WORKING_HOURS_NOT_FOUND') {
            return res.status(404).json({ error: "ساعات کاری یافت نشد." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const removeBreak = async (req, res) => {
    try {
        await StaffService.removeBreak(req.params.id);
        res.status(200).json({ success: true, message: "استراحت حذف شد." });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: "استراحت یافت نشد." });
        res.status(500).json({ error: "خطای سرور" });
    }
};

module.exports = { getWorkingHours, updateWorkingHours, bulkUpdateWorkingHours, addBreak, removeBreak };
