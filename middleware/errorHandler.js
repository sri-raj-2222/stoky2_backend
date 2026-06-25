/**
 * Global centralized Express error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}

/**
 * 404 Route Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
