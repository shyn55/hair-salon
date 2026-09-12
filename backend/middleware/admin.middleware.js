const requireAdmin = (req, res, next) => {
    if (!req.admin || req.admin.role !== 'admin') {
        return res.status(403).json({ error: "دسترسی مدیر لازم است." });
    }
    next();
};

module.exports = { requireAdmin };
