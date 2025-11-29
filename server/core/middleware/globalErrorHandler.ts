import { ClientError } from "../errors/ClientError.js";
import { ServerError } from "../errors/ServerError.js";
import type { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ClientError) {
        return res.clientError(err.message, err.details, err.statusCode);
    }

    if (err instanceof ServerError) {
        return res.serverError(err.message);
    }

    console.error(err);
    return res.serverError();
};
