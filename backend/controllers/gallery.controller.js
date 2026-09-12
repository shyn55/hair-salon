const GalleryService = require('../services/GalleryService');

const getGalleryItems = async (req, res) => {
    try {
        const { category, active } = req.query;
        const items = await GalleryService.getGalleryItems({ category, active });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createGalleryItem = async (req, res) => {
    try {
        const { imageUrl, thumbnail, title, category } = req.body;
        const item = await GalleryService.createGalleryItem({ imageUrl, thumbnail, title, category });
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await GalleryService.updateGalleryItem(id, req.body);
        res.json({ success: true, data: item });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Not found' });
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteGalleryItem = async (req, res) => {
    try {
        await GalleryService.deleteGalleryItem(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'Not found' });
        res.status(500).json({ error: 'Server error' });
    }
};

const reorderGallery = async (req, res) => {
    try {
        const { items } = req.body;
        await GalleryService.reorderGallery(items);
        res.json({ success: true, message: 'Reordered' });
    } catch (error) {
        if (error.message === 'ITEMS_ARRAY_REQUIRED') {
            return res.status(400).json({ error: 'Items array required' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem, reorderGallery };
