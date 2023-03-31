"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functional_1 = require("../functional/functional");
const general_1 = require("../general/general");
function extend(source, target) {
    for (const key in source) {
        target[key] = source[key];
    }
    return target;
}
exports.extend = extend;
function omitFalsyValues(obj) {
    return pickValues(obj, general_1.isTruthy);
}
exports.omitFalsyValues = omitFalsyValues;
function mapValues(obj, fn) {
    return Object.keys(obj).reduce((result, key) => {
        result[key] = fn(obj[key]);
        return result;
    }, {});
}
exports.mapValues = mapValues;
function pickValues(obj, predicate) {
    return Object.keys(obj).reduce((result, key) => {
        const value = obj[key];
        if (predicate(value)) {
            result[key] = value;
        }
        return result;
    }, {});
}
exports.pickValues = pickValues;
function fromEntries(entries) {
    return entries.reduce((result, [key, value]) => functional_1.assoc(result, key, value), {});
}
exports.fromEntries = fromEntries;
//# sourceMappingURL=object.js.map