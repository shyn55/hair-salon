const AuthService = require('../services/AuthService');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await AuthService.login({ username, password });

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        if (error.message === 'CREDENTIALS_REQUIRED') {
            return res.status(400).json({ error: "نام کاربری و رمز عبور لازم است." });
        }
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: "نام کاربری یا رمز عبور اشتباه است." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await AuthService.register({ username, password });

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ success: true, ...result });
    } catch (error) {
        if (error.message === 'CREDENTIALS_REQUIRED') {
            return res.status(400).json({ error: "نام کاربری و رمز عبور لازم است." });
        }
        if (error.message === 'PASSWORD_TOO_SHORT') {
            return res.status(400).json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد." });
        }
        if (error.message === 'USERNAME_TAKEN') {
            return res.status(409).json({ error: "این نام کاربری قبلاً استفاده شده." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "خروج موفقیت‌آمیز بود." });
};

const getProfile = async (req, res) => {
    try {
        const admin = await AuthService.getProfile(req.admin.id);
        res.status(200).json({ success: true, admin });
    } catch (error) {
        if (error.message === 'ADMIN_NOT_FOUND') {
            return res.status(404).json({ error: "ادمین یافت نشد." });
        }
        res.status(500).json({ error: "خطای سرور" });
    }
};

module.exports = { login, register, logout, getProfile };
