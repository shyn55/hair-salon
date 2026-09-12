const ServiceService = require('../services/ServiceService');

// ─── Categories ────────────────────────────────────

const getCategories = async (req, res) => {
    try {
        const categories = await ServiceService.getCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, gender } = req.body;
        const category = await ServiceService.createCategory({ name, gender });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ error: "نام و جنسیت دسته‌بندی لازم است." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, gender } = req.body;
        const category = await ServiceService.updateCategory(id, { name, gender });
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: "دسته‌بندی یافت نشد." });
        res.status(500).json({ error: "خطای سرور" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await ServiceService.deleteCategory(id);
        res.status(200).json({ success: true, message: "دسته‌بندی حذف شد." });
    } catch (error) {
        if (error.message === 'CATEGORY_HAS_SERVICES') {
            return res.status(400).json({ error: "این دسته‌بندی دارای سرویس است و قابل حذف نیست." });
        }
        if (error.code === 'P2025') return res.status(404).json({ error: "دسته‌بندی یافت نشد." });
        res.status(500).json({ error: "خطای سرور" });
    }
};

// ─── Services ──────────────────────────────────────

const getServices = async (req, res) => {
    try {
        const { categoryId, active } = req.query;
        const services = await ServiceService.getServices({ categoryId, active });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ error: "خطای سرور" });
    }
};

const getServiceById = async (req, res) => {
    try {
        const service = await ServiceService.getServiceById(req.params.id);
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        if (error.message === 'SERVICE_NOT_FOUND') {
            return res.status(404).json({ error: "سرویس یافت نشد." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const createService = async (req, res) => {
    try {
        const { title, description, duration, price, categoryId, isActive } = req.body;
        const service = await ServiceService.createService({ title, description, duration, price, categoryId, isActive });
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ error: "فیلدهای اجباری را پر کنید." });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ error: "دسته‌بندی معتبر نیست." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await ServiceService.updateService(id, req.body);
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: "سرویس یافت نشد." });
        res.status(500).json({ error: "خطای سرور" });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ServiceService.deleteService(id);
        if (result.softDeleted) {
            return res.status(200).json({ success: true, message: "سرویس غیرفعال شد (به دلیل وجود رزروهای فعال)." });
        }
        res.status(200).json({ success: true, message: "سرویس حذف شد." });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: "سرویس یافت نشد." });
        res.status(500).json({ error: "خطای سرور" });
    }
};

module.exports = {
    getCategories, createCategory, updateCategory, deleteCategory,
    getServices, getServiceById, createService, updateService, deleteService
};
