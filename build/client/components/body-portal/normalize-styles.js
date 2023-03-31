"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../../../common/utils/object/object");
function normalizeDimension(dimension) {
    if (typeof dimension === "number") {
        return Math.round(dimension) + "px";
    }
    if (typeof dimension === "string") {
        return dimension;
    }
    return undefined;
}
function normalizeStyles(source) {
    const { left, top, bottom, right, disablePointerEvents, isAboveAll } = source;
    const dimensions = {
        top: normalizeDimension(top),
        bottom: normalizeDimension(bottom),
        left: normalizeDimension(left),
        right: normalizeDimension(right)
    };
    return {
        ...object_1.omitFalsyValues(dimensions),
        zIndex: 200 + (isAboveAll ? 1 : 0),
        pointerEvents: disablePointerEvents ? "none" : "auto"
    };
}
exports.default = normalizeStyles;
//# sourceMappingURL=normalize-styles.js.map