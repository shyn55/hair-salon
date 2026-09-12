const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const generateToken = (admin) => {
    return jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const login = async ({ username, password }) => {
    if (!username || !password) {
        throw new Error('CREDENTIALS_REQUIRED');
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = generateToken(admin);
    return {
        token,
        admin: { id: admin.id, username: admin.username }
    };
};

const register = async ({ username, password }) => {
    if (!username || !password) {
        throw new Error('CREDENTIALS_REQUIRED');
    }

    if (password.length < 6) {
        throw new Error('PASSWORD_TOO_SHORT');
    }

    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
        throw new Error('USERNAME_TAKEN');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({
        data: { username, password: hashedPassword }
    });

    const token = generateToken(admin);
    return {
        token,
        admin: { id: admin.id, username: admin.username }
    };
};

const getProfile = async (adminId) => {
    const admin = await prisma.admin.findUnique({
        where: { id: adminId },
        select: { id: true, username: true }
    });
    if (!admin) throw new Error('ADMIN_NOT_FOUND');
    return admin;
};

module.exports = { login, register, getProfile };
