const prisma = require('../utils/prisma');

const getSettings = async () => {
    const settings = await prisma.siteSetting.findMany();
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    return obj;
};

const updateSettings = async (settingsData) => {
    const results = [];
    for (const [key, value] of Object.entries(settingsData)) {
        const result = await prisma.siteSetting.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
        });
        results.push(result);
    }
    return results;
};

module.exports = { getSettings, updateSettings };
