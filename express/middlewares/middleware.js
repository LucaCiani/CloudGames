function notFound(req, res, next) {
  res.status(404).json({
    error: true,
    message: "Route not found",
  });
}

function serverError(err, req, res, next) {
  res.status(500).json({
    error: true,
    message: "Internal server error",
    details: err.message,
  });
}

export { notFound, serverError };
