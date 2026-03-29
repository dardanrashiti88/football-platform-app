function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : 'Request Error',
    message: error.message || 'Unexpected error',
    details: error.details || null,
  });
}

module.exports = { errorHandler };
