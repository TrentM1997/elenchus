export class ServerError extends Error {
    statusCode: number;
    details: unknown;

    constructor(message = "Internal server error", statusCode = 500, details: unknown = null) {

        super(message);
        this.name = "ServerError";
        this.statusCode = statusCode;
        this.details = details;

        Object.setPrototypeOf(this, ServerError.prototype);
    }
};
