"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../common/utils/general/general");
const view_definitions_1 = require("../../../common/view-definitions");
const request_errors_1 = require("../request-errors/request-errors");
function parseViewDefinitionConverter(req) {
    const { viewDefinitionVersion } = req.body;
    if (general_1.isNil(viewDefinitionVersion)) {
        throw new request_errors_1.InvalidRequestError("Parameter viewDefinitionVersion is required");
    }
    const converter = view_definitions_1.definitionConverters[String(viewDefinitionVersion)];
    if (converter == null) {
        throw new request_errors_1.InvalidRequestError(`Unsupported viewDefinitionVersion value: ${viewDefinitionVersion}`);
    }
    return converter;
}
exports.parseViewDefinitionConverter = parseViewDefinitionConverter;
//# sourceMappingURL=parse-view-definition-converter.js.map