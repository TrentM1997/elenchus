export class ClientError extends Error {
    details;
    statusCode;
    constructor(message, details = null, statusCode = 400) {
        super(message);
        this.name = "ClientError";
        this.message = message;
        this.details = details;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ClientError.prototype);
    }
}
;
//# sourceMappingURL=ClientError.js.map