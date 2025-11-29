import type { Response } from "express";


const success = (res: Response, message: string, data: unknown, status = 200) => {
    return res.status(status).json({
        status: "success",
        message,
        data
    });
};

const clientError = (res: Response, message: string, data: unknown, status = 400) => {
    return res.status(status).json({
        status: "failed",
        message,
        data
    });
};

const serverError = (res: Response, message = "Internal Server Error", data: unknown = null, status = 500) => {
    return res.status(status).json({
        status: "error",
        message,
        data
    });
};


export { serverError, clientError, success };