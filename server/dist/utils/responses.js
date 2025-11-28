const successResponse = (res, message, data, status = 200) => {
    return res.status(status).json({
        status: "success",
        message,
        data
    });
};
const clientErrorResponse = (res, message, data, status = 400) => {
    return res.status(status).json({
        status: "failed",
        message,
        data
    });
};
const serverErrorResponse = (res, message = "Internal Server Error", data = null, status = 500) => {
    return res.status(status).json({
        status: "error",
        message,
        data
    });
};
export { serverErrorResponse, clientErrorResponse, successResponse };
//# sourceMappingURL=responses.js.map