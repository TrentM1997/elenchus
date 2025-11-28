import type { Response } from "express";


const successResponse = (res: Response, message: string, data: unknown, status = 200) => {
    return res.status(status).json({
        status: "success",
        message,
        data
    });
};

const clientErrorResponse = (res: Response, message: string, data: unknown, status = 400) => {
    return res.status(status).json({
        status: "failed",
        message,
        data
    });
};

const serverErrorResponse = (res: Response, message = "Internal Server Error", data: unknown = null, status = 500) => {
    return res.status(status).json({
        status: "error",
        message,
        data
    });
};


export { serverErrorResponse, clientErrorResponse, successResponse };