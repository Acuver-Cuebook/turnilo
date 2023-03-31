"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_cube_1 = require("../../models/data-cube/data-cube");
function splitCanonicalLength(split, dataCube) {
    const { reference, bucket } = split;
    if (reference !== data_cube_1.getTimeDimensionReference(dataCube))
        return null;
    return bucket.getCanonicalLength();
}
exports.default = splitCanonicalLength;
//# sourceMappingURL=split-canonical-length.js.map