const ProfileService = require('../services/ProfileService');

const getProfile = async (req, res) => {
    try {
        const profile = await ProfileService.getProfile();
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const profile = await ProfileService.updateProfile(req.body);
        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getSocialLinks = async (req, res) => {
    try {
        const links = await ProfileService.getSocialLinks();
        res.json({ success: true, data: links });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const addSocialLink = async (req, res) => {
    try {
        const { platform, url, label } = req.body;
        const link = await ProfileService.addSocialLink({ platform, url, label });
        res.status(201).json({ success: true, data: link });
    } catch (error) {
        if (error.message === 'PROFILE_NOT_FOUND') {
            return res.status(400).json({ error: 'Create profile first' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const updateSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await ProfileService.updateSocialLink(id, req.body);
        res.json({ success: true, data: link });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Not found' });
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteSocialLink = async (req, res) => {
    try {
        await ProfileService.deleteSocialLink(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Not found' });
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile, getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink };
