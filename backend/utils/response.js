const success = (res, data = null, statusCode = 200) => {
    const response = { success: true };
    if (data !== null) response.data = data;
    return res.status(statusCode).json(response);
};

const error = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({ success: false, error: message });
};

const paginated = (res, data, page, limit, total) => {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};

module.exports = { success, error, paginated };
