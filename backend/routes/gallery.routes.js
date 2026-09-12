const express = require('express');
const router = express.Router();
const { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem, reorderGallery } = require('../controllers/gallery.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public
router.get('/', getGalleryItems);

// Admin
router.post('/', authenticate, createGalleryItem);
router.put('/reorder/bulk', authenticate, reorderGallery);
router.put('/:id', authenticate, updateGalleryItem);
router.delete('/:id', authenticate, deleteGalleryItem);

module.exports = router;
