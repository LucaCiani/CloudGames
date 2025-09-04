function notFound(req, res, next) {
    res.status(404).json({
        error: true,
        message: "Route not found - La rotta richiesta non esiste"
    });
}

module.exports = notFound