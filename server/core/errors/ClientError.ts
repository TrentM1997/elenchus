export class ClientError extends Error {
    details: unknown;
    statusCode: number;

    constructor(message: string, details: unknown = null, statusCode = 400) {

        super(message);
        this.name = "ClientError";
        this.message = message;
        this.details = details;
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, ClientError.prototype);
    }
};