const SettingsService = require('../services/SettingsService');

const getSettings = async (req, res) => {
    try {
        const settings = await SettingsService.getSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const results = await SettingsService.updateSettings(req.body);
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getSettings, updateSettings };
