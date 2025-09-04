function serverError(err, req, res, next) {


  res.status(500).json({
    error: true,
    message: "Internal server error",
    details: err.message
  })
}

module.exports = serverError