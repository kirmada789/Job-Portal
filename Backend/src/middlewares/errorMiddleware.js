const errorHandler = (err, req, res, next ) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === "CastError") {
        message = `Resource not found. Invalid: ${err.path}`;
        statusCode = 404;
    }

    if (err.code === 11000 ) {
        message = `Duplicate field value entered: ${Object.keys(err.keyValue)} already exists`;
        statusCode = 400;
    }

    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map(val => val.message).join(", ");
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = errorHandler;