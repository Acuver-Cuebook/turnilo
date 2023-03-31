"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../../common/models/dimension/dimensions");
const general_1 = require("../../../common/utils/general/general");
const request_errors_1 = require("../request-errors/request-errors");
function parseDimension(req, dataCube) {
    const dimensionName = req.body.dimension;
    if (general_1.isNil(dimensionName)) {
        throw new request_errors_1.InvalidRequestError("Parameter dimension is required");
    }
    if (typeof dimensionName !== "string") {
        throw new request_errors_1.InvalidRequestError(`Expected dimension to be a string, got: ${typeof dimensionName}`);
    }
    const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, dimensionName);
    if (general_1.isNil(dimension)) {
        throw new request_errors_1.InvalidRequestError(`Unknown dimension: ${dimensionName}`);
    }
    return dimension;
}
exports.parseDimension = parseDimension;
//# sourceMappingURL=parse-dimension.js.map