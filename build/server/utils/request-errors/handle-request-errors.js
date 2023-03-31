"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../common/logger/logger");
const request_errors_1 = require("./request-errors");
function handleRequestErrors(error, res, logger) {
    if (request_errors_1.isInvalidRequestError(error)) {
        res.status(error.code).send({ error: error.message });
        return;
    }
    if (request_errors_1.isAccessDeniedError(error)) {
        res.status(error.code).send({ error: error.message });
        return;
    }
    logger.error(logger_1.errorToMessage(error));
    res.status(500).send({
        error: "Unexpected error",
        message: error.message
    });
}
exports.handleRequestErrors = handleRequestErrors;
//# sourceMappingURL=handle-request-errors.js.map