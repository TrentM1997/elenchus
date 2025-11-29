import "express";

declare global {
    namespace Express {
        interface Response {
            success(message: string, data?: unknown, status?: number): Response;
            clientError(message: string, data?: unknown, status?: number): Response;
            serverError(message?: string, data?: unknown, status?: number): Response;
        }
    }
}
