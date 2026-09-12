const prisma = require('../utils/prisma');

// ─── Time Helpers ─────────────────────────────────

const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (mins) => {
    const hours = Math.floor(mins / 60).toString().padStart(2, '0');
    const minutes = (mins % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const parseLocalDate = (dateStr) => {
    // Parse 'YYYY-MM-DD' as UTC midnight so PostgreSQL stores the exact day
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
};

// ─── Single Source of Truth: Conflict Detection ───

/**
 * Check if a proposed time slot conflicts with existing bookings.
 * This is THE canonical overlap check — used by both availability and booking creation.
 *
 * @param {Object} tx - Prisma transaction client
 * @param {Date} date - The target date
 * @param {string} startTime - Slot start time (HH:MM)
 * @param {string} endTime - Slot end time (HH:MM)
 * @param {string} [excludeBookingId] - Booking ID to exclude (for updates)
 * @returns {Promise<Object|null>} The conflicting booking, or null
 */
const findConflict = async (tx, date, startTime, endTime, excludeBookingId = null) => {
    const where = {
        date,
        status: { not: 'CANCELLED' },
        OR: [
            { startTime: { lt: endTime }, endTime: { gt: startTime } }
        ]
    };

    if (excludeBookingId) {
        where.id = { not: excludeBookingId };
    }

    return tx.booking.findFirst({ where });
};

// ─── Slot Generation ──────────────────────────────

const getAvailableSlots = async (dateStr, serviceDurationMinutes) => {
    if (!dateStr || typeof dateStr !== 'string') throw new Error('INVALID_DATE');
    if (!serviceDurationMinutes || serviceDurationMinutes <= 0) throw new Error('INVALID_DURATION');
    const targetDate = parseLocalDate(dateStr);
    if (isNaN(targetDate.getTime())) throw new Error('INVALID_DATE');
    const dayOfWeek = targetDate.getUTCDay();

    // Check for SpecialDay first
    const specialDay = await prisma.specialDay.findFirst({
        where: { date: targetDate }
    });

    let workingHours;

    if (specialDay) {
        if (specialDay.isClosed) return [];
        workingHours = {
            startTime: specialDay.startTime || '09:00',
            endTime: specialDay.endTime || '20:00',
            isClosed: false,
            breaks: []
        };
    } else {
        workingHours = await prisma.workingHours.findFirst({
            where: { dayOfWeek, isClosed: false },
            include: { breaks: true }
        });
    }

    if (!workingHours || workingHours.isClosed) return [];

    const existingBookings = await prisma.booking.findMany({
        where: { date: targetDate, status: { not: 'CANCELLED' } }
    });

    let availableSlots = [];
    let currentTime = timeToMinutes(workingHours.startTime);
    const closeTime = timeToMinutes(workingHours.endTime);

    while (currentTime + serviceDurationMinutes <= closeTime) {
        const slotStart = currentTime;
        const slotEnd = currentTime + serviceDurationMinutes;

        const isDuringBreak = (workingHours.breaks || []).some(b =>
            (slotStart < timeToMinutes(b.endTime) && slotEnd > timeToMinutes(b.startTime))
        );

        const isBooked = existingBookings.some(booking =>
            (slotStart < timeToMinutes(booking.endTime) && slotEnd > timeToMinutes(booking.startTime))
        );

        if (!isDuringBreak && !isBooked) {
            availableSlots.push(minutesToTime(currentTime));
        }
        currentTime += 30;
    }
    return availableSlots;
};

// ─── Day Status ───────────────────────────────────

const getDayStatus = async (dateStr, serviceDurationMinutes) => {
    if (!dateStr || typeof dateStr !== 'string') throw new Error('INVALID_DATE');
    const targetDate = parseLocalDate(dateStr);
    if (isNaN(targetDate.getTime())) throw new Error('INVALID_DATE');
    const dayOfWeek = targetDate.getUTCDay();
    const today = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
    ));

    if (targetDate.getTime() < today.getTime()) return 'past';

    const specialDay = await prisma.specialDay.findFirst({ where: { date: targetDate } });
    if (specialDay && specialDay.isClosed) return 'closed';

    if (!specialDay) {
        const wh = await prisma.workingHours.findFirst({ where: { dayOfWeek } });
        if (!wh || wh.isClosed) return 'closed';
    }

    const slots = await getAvailableSlots(dateStr, serviceDurationMinutes || 60);
    if (slots.length === 0) return 'booked';
    if (slots.length <= 2) return 'limited';
    return 'available';
};

// ─── Booking CRUD ─────────────────────────────────

const createBooking = async ({ customerName, phone, date, startTime, serviceId }) => {
    if (!date || !startTime || !serviceId || !customerName || !phone) {
        throw new Error('MISSING_FIELDS');
    }
    const targetDate = parseLocalDate(date);
    if (isNaN(targetDate.getTime())) throw new Error('INVALID_DATE');
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error('SERVICE_NOT_FOUND');

    const startMins = timeToMinutes(startTime);
    const endTime = minutesToTime(startMins + service.duration);

    const result = await prisma.$transaction(async (tx) => {
        // Use the single-source conflict check
        const conflict = await findConflict(tx, targetDate, startTime, endTime);
        if (conflict) throw new Error('SLOT_TAKEN');

        return tx.booking.create({
            data: {
                customer: customerName,
                phone,
                date: targetDate,
                startTime,
                endTime,
                price: service.price,
                serviceId: service.id,
                status: 'CONFIRMED'
            }
        });
    });

    return result;
};

module.exports = { getAvailableSlots, getDayStatus, createBooking };
