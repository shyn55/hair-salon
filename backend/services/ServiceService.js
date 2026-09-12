const prisma = require('../utils/prisma');

// ─── Categories ────────────────────────────────────

const getCategories = async () => {
    return prisma.category.findMany({
        include: { services: { where: { isActive: true } } },
        orderBy: { name: 'asc' }
    });
};

const createCategory = async ({ name, gender }) => {
    if (!name || !gender) throw new Error('VALIDATION_ERROR');
    return prisma.category.create({ data: { name, gender } });
};

const updateCategory = async (id, { name, gender }) => {
    return prisma.category.update({
        where: { id },
        data: { ...(name && { name }), ...(gender && { gender }) }
    });
};

const deleteCategory = async (id) => {
    const serviceCount = await prisma.service.count({ where: { categoryId: id } });
    if (serviceCount > 0) {
        throw new Error('CATEGORY_HAS_SERVICES');
    }
    return prisma.category.delete({ where: { id } });
};

// ─── Services ──────────────────────────────────────

const getServices = async (filters = {}) => {
    const where = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.active !== undefined) where.isActive = filters.active === 'true';

    return prisma.service.findMany({
        where,
        include: { category: true },
        orderBy: { title: 'asc' }
    });
};

const getServiceById = async (id) => {
    const service = await prisma.service.findUnique({
        where: { id },
        include: { category: true }
    });
    if (!service) throw new Error('SERVICE_NOT_FOUND');
    return service;
};

const createService = async ({ title, description, duration, price, categoryId, isActive }) => {
    if (!title || !duration || !price || !categoryId) {
        throw new Error('VALIDATION_ERROR');
    }

    return prisma.service.create({
        data: {
            title,
            description: description || null,
            duration,
            price,
            categoryId,
            isActive: isActive !== undefined ? isActive : true
        },
        include: { category: true }
    });
};

const updateService = async (id, data) => {
    const { title, description, duration, price, categoryId, isActive } = data;
    return prisma.service.update({
        where: { id },
        data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(duration !== undefined && { duration }),
            ...(price !== undefined && { price }),
            ...(categoryId !== undefined && { categoryId }),
            ...(isActive !== undefined && { isActive })
        },
        include: { category: true }
    });
};

const deleteService = async (id) => {
    const bookingCount = await prisma.booking.count({
        where: { serviceId: id, status: { not: 'CANCELLED' } }
    });

    if (bookingCount > 0) {
        // Soft delete — deactivate instead of removing
        await prisma.service.update({ where: { id }, data: { isActive: false } });
        return { softDeleted: true };
    }

    await prisma.service.delete({ where: { id } });
    return { softDeleted: false };
};

// ─── Public Queries ────────────────────────────────

const getPublicServices = async (gender) => {
    const where = { isActive: true };
    if (gender) where.category = { gender };

    return prisma.service.findMany({
        where,
        include: { category: true },
        orderBy: { title: 'asc' }
    });
};

const getPublicCategories = async () => {
    return prisma.category.findMany({
        include: { services: { where: { isActive: true } } }
    });
};

module.exports = {
    getCategories, createCategory, updateCategory, deleteCategory,
    getServices, getServiceById, createService, updateService, deleteService,
    getPublicServices, getPublicCategories
};
