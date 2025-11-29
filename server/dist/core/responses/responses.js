const success = (res, message, data, status = 200) => {
    return res.status(status).json({
        status: "success",
        message,
        data
    });
};
const clientError = (res, message, data, status = 400) => {
    return res.status(status).json({
        status: "failed",
        message,
        data
    });
};
const serverError = (res, message = "Internal Server Error", data = null, status = 500) => {
    return res.status(status).json({
        status: "error",
        message,
        data
    });
};
export { serverError, clientError, success };
//# sourceMappingURL=responses.js.map