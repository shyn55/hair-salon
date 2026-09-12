const { PrismaClient } = require('@prisma/client');
const prisma = require('./prisma');

const getBookingById = async (id) => {
    return prisma.booking.findUnique({
        where: { id },
        include: { service: { include: { category: true } } }
    });
};

const getBookingsByDate = async (date) => {
    const targetDate = new Date(date);
    return prisma.booking.findMany({
        where: { date: targetDate, status: { not: 'CANCELLED' } },
        include: { service: true },
        orderBy: { startTime: 'asc' }
    });
};

const cancelBooking = async (id) => {
    return prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' }
    });
};

module.exports = { getBookingById, getBookingsByDate, cancelBooking };
