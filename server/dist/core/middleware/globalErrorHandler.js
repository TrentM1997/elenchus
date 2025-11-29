import { ClientError } from "../errors/ClientError.js";
import { ServerError } from "../errors/ServerError.js";
export const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof ClientError) {
        return res.clientError(err.message, err.details, err.statusCode);
    }
    if (err instanceof ServerError) {
        return res.serverError(err.message);
    }
    console.error(err);
    return res.serverError();
};
//# sourceMappingURL=globalErrorHandler.js.map