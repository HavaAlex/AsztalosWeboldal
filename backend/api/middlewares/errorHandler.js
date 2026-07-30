exports.notFoundError = (req, res, next) =>
{
    const error = new Error("Not found");
    error.status = 404;

    next(error);
}

exports.showError = (error, req, res, next) =>
{
    const message = error.message || "Unknown error";

    const status = error.status || 500;
    console.log("error: ",message)
    res.status(status).send(message);
}