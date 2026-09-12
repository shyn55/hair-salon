const prisma = require('../utils/prisma');

const getGalleryItems = async (filters = {}) => {
    const where = {};
    if (filters.category && filters.category !== 'all') where.category = filters.category;
    if (filters.active !== undefined) where.isActive = filters.active === 'true';

    return prisma.galleryItem.findMany({ where, orderBy: { sortOrder: 'asc' } });
};

const createGalleryItem = async ({ imageUrl, thumbnail, title, category }) => {
    const maxOrder = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } });
    return prisma.galleryItem.create({
        data: {
            imageUrl,
            thumbnail,
            title,
            category: category || 'all',
            sortOrder: (maxOrder._max.sortOrder || 0) + 1
        }
    });
};

const updateGalleryItem = async (id, data) => {
    const { imageUrl, thumbnail, title, category, isActive, sortOrder } = data;
    return prisma.galleryItem.update({
        where: { id },
        data: {
            ...(imageUrl && { imageUrl }),
            ...(thumbnail !== undefined && { thumbnail }),
            ...(title !== undefined && { title }),
            ...(category && { category }),
            ...(isActive !== undefined && { isActive }),
            ...(sortOrder !== undefined && { sortOrder })
        }
    });
};

const deleteGalleryItem = async (id) => {
    return prisma.galleryItem.delete({ where: { id } });
};

const reorderGallery = async (items) => {
    if (!Array.isArray(items)) throw new Error('ITEMS_ARRAY_REQUIRED');
    await Promise.all(items.map((item, index) =>
        prisma.galleryItem.update({ where: { id: item.id }, data: { sortOrder: index } })
    ));
};

module.exports = {
    getGalleryItems, createGalleryItem, updateGalleryItem,
    deleteGalleryItem, reorderGallery
};
