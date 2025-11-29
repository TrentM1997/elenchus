import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Response {
        success(message: string, data?: unknown, status?: number): this;
        clientError(message: string, data?: unknown, status?: number): this;
        serverError(message?: string, data?: unknown, status?: number): this;
    }
}
