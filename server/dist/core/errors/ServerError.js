export class ServerError extends Error {
    statusCode;
    details;
    constructor(message = "Internal server error", statusCode = 500, details = null) {
        super(message);
        this.name = "ServerError";
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
;
//# sourceMappingURL=ServerError.js.map