const prisma = require('../utils/prisma');

const DAY_NAMES = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

const getWorkingHours = async () => {
    const hours = await prisma.workingHours.findMany({
        include: { breaks: true },
        orderBy: { dayOfWeek: 'asc' }
    });

    return hours.map(h => ({
        ...h,
        dayName: DAY_NAMES[h.dayOfWeek] || `Day ${h.dayOfWeek}`
    }));
};

const updateWorkingHours = async (id, { startTime, endTime, isClosed }) => {
    return prisma.workingHours.update({
        where: { id },
        data: {
            ...(startTime !== undefined && { startTime }),
            ...(endTime !== undefined && { endTime }),
            ...(isClosed !== undefined && { isClosed })
        },
        include: { breaks: true }
    });
};

const bulkUpdateWorkingHours = async (schedule) => {
    if (!Array.isArray(schedule)) throw new Error('SCHEDULE_ARRAY_REQUIRED');

    return Promise.all(
        schedule.map(item =>
            prisma.workingHours.update({
                where: { id: item.id },
                data: {
                    ...(item.startTime !== undefined && { startTime: item.startTime }),
                    ...(item.endTime !== undefined && { endTime: item.endTime }),
                    ...(item.isClosed !== undefined && { isClosed: item.isClosed })
                }
            })
        )
    );
};

const addBreak = async ({ workingHoursId, startTime, endTime }) => {
    if (!workingHoursId || !startTime || !endTime) {
        throw new Error('VALIDATION_ERROR');
    }

    const wh = await prisma.workingHours.findUnique({ where: { id: workingHoursId } });
    if (!wh) throw new Error('WORKING_HOURS_NOT_FOUND');

    return prisma.break.create({
        data: { workingHoursId, startTime, endTime }
    });
};

const removeBreak = async (id) => {
    return prisma.break.delete({ where: { id } });
};

// ─── Public Query ──────────────────────────────────

const getPublicWorkingHours = async () => {
    return prisma.workingHours.findMany({
        include: { breaks: true },
        orderBy: { dayOfWeek: 'asc' }
    });
};

module.exports = {
    getWorkingHours, updateWorkingHours, bulkUpdateWorkingHours,
    addBreak, removeBreak, getPublicWorkingHours
};
