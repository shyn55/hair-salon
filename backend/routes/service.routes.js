const express = require('express');
const router = express.Router();
const {
    getCategories, createCategory, updateCategory, deleteCategory,
    getServices, getServiceById, createService, updateService, deleteService
} = require('../controllers/service.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Public routes
router.get('/categories', getCategories);
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin routes
router.post('/categories', authenticate, requireAdmin, createCategory);
router.put('/categories/:id', authenticate, requireAdmin, updateCategory);
router.delete('/categories/:id', authenticate, requireAdmin, deleteCategory);

router.post('/', authenticate, requireAdmin, createService);
router.put('/:id', authenticate, requireAdmin, updateService);
router.delete('/:id', authenticate, requireAdmin, deleteService);

module.exports = router;
