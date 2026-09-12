const prisma = require('../utils/prisma');

// ─── Profile ───────────────────────────────────────

const getProfile = async () => {
    const profile = await prisma.profile.findFirst({
        include: { socialLinks: { orderBy: { sortOrder: 'asc' } } }
    });
    return profile;
};

const updateProfile = async (data) => {
    const { firstName, lastName, title, bio, shortBio, phone, email, address, googleMapsUrl, avatar, heroImage, workingHoursNote } = data;
    let profile = await prisma.profile.findFirst();

    if (!profile) {
        profile = await prisma.profile.create({
            data: { firstName, lastName, title, phone, bio, shortBio, email, address, googleMapsUrl, avatar, heroImage, workingHoursNote }
        });
    } else {
        profile = await prisma.profile.update({
            where: { id: profile.id },
            data: { firstName, lastName, title, bio, shortBio, phone, email, address, googleMapsUrl, avatar, heroImage, workingHoursNote }
        });
    }

    return profile;
};

// ─── Social Links ──────────────────────────────────

const getSocialLinks = async () => {
    return prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } });
};

const addSocialLink = async ({ platform, url, label }) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) throw new Error('PROFILE_NOT_FOUND');

    const maxOrder = await prisma.socialLink.aggregate({ _max: { sortOrder: true } });
    return prisma.socialLink.create({
        data: {
            platform,
            url,
            label,
            sortOrder: (maxOrder._max.sortOrder || 0) + 1,
            profileId: profile.id
        }
    });
};

const updateSocialLink = async (id, data) => {
    const { platform, url, label, isActive, sortOrder } = data;
    return prisma.socialLink.update({
        where: { id },
        data: {
            ...(platform && { platform }),
            ...(url && { url }),
            ...(label !== undefined && { label }),
            ...(isActive !== undefined && { isActive }),
            ...(sortOrder !== undefined && { sortOrder })
        }
    });
};

const deleteSocialLink = async (id) => {
    return prisma.socialLink.delete({ where: { id } });
};

module.exports = {
    getProfile, updateProfile,
    getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink
};
