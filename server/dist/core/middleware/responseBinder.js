import { clientError, serverError, success } from "../responses/responses.js";
export const responseBinder = (req, res, next) => {
    res.success = (message, data = null, status = 200) => {
        return success(res, message, data, status);
    };
    res.clientError = (message, data = null, status = 400) => {
        return clientError(res, message, data, status);
    };
    res.serverError = (message = "Internal Server Error", data = null, status = 500) => {
        return serverError(res, message, data, status);
    };
    next();
};
//# sourceMappingURL=responseBinder.js.map