const prisma = require('../utils/prisma');

const getStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        totalBookings,
        todayBookings,
        totalRevenue,
        todayRevenue,
        totalServices,
        pendingBookings
    ] = await Promise.all([
        prisma.booking.count({ where: { status: { not: 'CANCELLED' } } }),
        prisma.booking.count({
            where: { date: { gte: today, lt: tomorrow }, status: { not: 'CANCELLED' } }
        }),
        prisma.booking.aggregate({
            _sum: { price: true },
            where: { status: { not: 'CANCELLED' } }
        }),
        prisma.booking.aggregate({
            _sum: { price: true },
            where: { date: { gte: today, lt: tomorrow }, status: { not: 'CANCELLED' } }
        }),
        prisma.service.count({ where: { isActive: true } }),
        prisma.booking.count({ where: { status: 'PENDING' } })
    ]);

    return {
        totalBookings,
        todayBookings,
        totalRevenue: totalRevenue._sum.price || 0,
        todayRevenue: todayRevenue._sum.price || 0,
        totalServices,
        pendingBookings
    };
};

const getTodayBookings = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.booking.findMany({
        where: { date: { gte: today, lt: tomorrow } },
        include: { service: true },
        orderBy: { startTime: 'asc' }
    });
};

const getAllBookings = async ({ page = 1, limit = 20, status, date }) => {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (date) {
        const targetDate = new Date(date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        where.date = { gte: targetDate, lt: nextDay };
    }

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            include: { service: true },
            orderBy: { date: 'desc' },
            skip,
            take: parseInt(limit)
        }),
        prisma.booking.count({ where })
    ]);

    return {
        data: bookings,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
        }
    };
};

const updateBookingStatus = async (id, status) => {
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
        throw new Error('INVALID_STATUS');
    }

    return prisma.booking.update({
        where: { id },
        data: { status },
        include: { service: true }
    });
};

const getRevenueReport = async ({ startDate, endDate } = {}) => {
    const where = { status: { not: 'CANCELLED' } };

    if (startDate && endDate) {
        where.date = {
            gte: new Date(startDate),
            lte: new Date(endDate)
        };
    }

    const bookings = await prisma.booking.groupBy({
        by: ['date'],
        _sum: { price: true },
        _count: true,
        where,
        orderBy: { date: 'asc' }
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b._sum.price || 0), 0);
    const totalBookings = bookings.reduce((sum, b) => sum + b._count, 0);

    return {
        daily: bookings.map(b => ({
            date: b.date,
            revenue: b._sum.price || 0,
            count: b._count
        })),
        totalRevenue,
        totalBookings
    };
};

module.exports = {
    getStats, getTodayBookings, getAllBookings,
    updateBookingStatus, getRevenueReport
};
