const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public
router.get('/', getSettings);

// Admin
router.put('/', authenticate, updateSettings);

module.exports = router;
