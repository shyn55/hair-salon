const errorHandler = (err, req, res, next) => {
    console.error('Server Error:', err.message);

    if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: "داده تکراری است." });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({ error: "رکورد مورد نظر یافت نشد." });
        }
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: "توکن نامعتبر است." });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "توکن منقضی شده است." });
    }

    res.status(err.statusCode || 500).json({
        error: err.message || "خطای داخلی سرور"
    });
};

module.exports = { errorHandler };
