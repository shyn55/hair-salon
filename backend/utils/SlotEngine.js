const prisma = require('./prisma');

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

const getAvailableSlots = async (dateStr, serviceDurationMinutes) => {
    const targetDate = parseLocalDate(dateStr);
    const dayOfWeek = targetDate.getUTCDay();

    // Check for SpecialDay first
    const specialDay = await prisma.specialDay.findFirst({
        where: { date: targetDate }
    });

    let workingHours;

    if (specialDay) {
        if (specialDay.isClosed) return [];
        // Use special day hours
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

// Get day availability status for calendar
const getDayStatus = async (dateStr, serviceDurationMinutes) => {
    const targetDate = parseLocalDate(dateStr);
    const dayOfWeek = targetDate.getUTCDay();
    const today = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
    ));

    // Past dates
    if (targetDate.getTime() < today.getTime()) return 'past';

    // Check special day
    const specialDay = await prisma.specialDay.findFirst({ where: { date: targetDate } });
    if (specialDay && specialDay.isClosed) return 'closed';

    // Check working hours
    if (!specialDay) {
        const wh = await prisma.workingHours.findFirst({ where: { dayOfWeek } });
        if (!wh || wh.isClosed) return 'closed';
    }

    const slots = await getAvailableSlots(dateStr, serviceDurationMinutes || 60);
    if (slots.length === 0) return 'booked';
    if (slots.length <= 2) return 'limited';
    return 'available';
};

module.exports = { getAvailableSlots, getDayStatus, timeToMinutes, minutesToTime, parseLocalDate };
