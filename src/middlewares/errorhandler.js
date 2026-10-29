
const errorHandler = (error, req, res, next) => {
    console.error(error.stack);
    if (error.name === 'MulterError') {
        const messages = {
            LIMIT_FILE_SIZE: 'File too large. Maximum size is 3MB per image',
            LIMIT_FILE_COUNT: 'Too many files. Maximum is 5 images per post',
            LIMIT_UNEXPECTED_FILE: `Unexpected file field: ${error.field}`
        };
        const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(status).json({ error: messages[error.code] || error.message });
    }
    const status = error.status || 500;
    res.status(status).json({ error: error.message });

};
module.exports = errorHandler;
