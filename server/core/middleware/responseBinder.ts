import { clientError, serverError, success } from "../responses/responses.js";
import type { Request, Response, NextFunction } from "express";


export const responseBinder = (req: Request, res: Response, next: NextFunction) => {

    res.success = (message: string, data = null, status = 200) => {
        return success(res, message, data, status);
    };

    res.clientError = (message: string, data = null, status = 400) => {
        return clientError(res, message, data, status);
    };

    res.serverError = (message = "Internal Server Error", data = null, status = 500) => {
        return serverError(res, message, data, status);
    };

    next();
};