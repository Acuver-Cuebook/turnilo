"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const general_1 = require("../../../common/utils/general/general");
const request_errors_1 = require("../request-errors/request-errors");
function parseExpression(req) {
    const expression = req.body.expression;
    if (general_1.isNil(expression)) {
        throw new request_errors_1.InvalidRequestError("Parameter expression is required");
    }
    try {
        return plywood_1.Expression.fromJS(expression);
    }
    catch (e) {
        throw new request_errors_1.InvalidRequestError(`Bad expression: ${e.message}`);
    }
}
exports.parseExpression = parseExpression;
//# sourceMappingURL=parse-expression.js.map