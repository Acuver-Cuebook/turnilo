"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccessDeniedError extends Error {
    constructor() {
        super(...arguments);
        this.code = 403;
    }
}
exports.AccessDeniedError = AccessDeniedError;
class InvalidRequestError extends Error {
    constructor() {
        super(...arguments);
        this.code = 400;
    }
}
exports.InvalidRequestError = InvalidRequestError;
function isAccessDeniedError(e) {
    return e instanceof AccessDeniedError;
}
exports.isAccessDeniedError = isAccessDeniedError;
function isInvalidRequestError(e) {
    return e instanceof InvalidRequestError;
}
exports.isInvalidRequestError = isInvalidRequestError;
//# sourceMappingURL=request-errors.js.map