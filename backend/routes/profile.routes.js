const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink } = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public
router.get('/', getProfile);
router.get('/social-links', getSocialLinks);

// Admin
router.put('/', authenticate, updateProfile);
router.post('/social-links', authenticate, addSocialLink);
router.put('/social-links/:id', authenticate, updateSocialLink);
router.delete('/social-links/:id', authenticate, deleteSocialLink);

module.exports = router;
