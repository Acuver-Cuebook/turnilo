"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../common/utils/general/general");
const split_definition_1 = require("../../../common/view-definitions/version-4/split-definition");
const request_errors_1 = require("../request-errors/request-errors");
function parseSplit(req, dataCube) {
    const splitJS = req.body.split;
    if (general_1.isNil(splitJS)) {
        throw new request_errors_1.InvalidRequestError("Parameter split is required");
    }
    try {
        return split_definition_1.splitConverter.toSplitCombine(splitJS, dataCube);
    }
    catch (error) {
        throw new request_errors_1.InvalidRequestError(error.message);
    }
}
exports.parseSplit = parseSplit;
//# sourceMappingURL=parse-split.js.map