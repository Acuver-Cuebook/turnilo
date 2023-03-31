"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../common/utils/general/general");
const request_errors_1 = require("../request-errors/request-errors");
function parseViewDefinition(req) {
    const { viewDefinition } = req.body;
    if (general_1.isNil(viewDefinition)) {
        throw new request_errors_1.InvalidRequestError("Parameter viewDefinition is required");
    }
    if (typeof viewDefinition !== "object") {
        throw new request_errors_1.InvalidRequestError(`Expected viewDefinition to be an object, got: ${typeof viewDefinition}`);
    }
    return viewDefinition;
}
exports.parseViewDefinition = parseViewDefinition;
//# sourceMappingURL=parse-view-definition.js.map