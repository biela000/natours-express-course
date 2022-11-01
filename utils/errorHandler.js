const AppError = require('./appError');

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    handleDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let transformedErr = { ...err, name: err.name };

    if (transformedErr.name === 'CastError')
      transformedErr = handleCastErrorDB(transformedErr);

    handleProduction(transformedErr, res);
  }
};
