"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lz_string_1 = require("lz-string");
function arrayToHash(array) {
    const concatenated = array
        .map(element => JSON.stringify(element || null))
        .join(",");
    return lz_string_1.compressToBase64(concatenated);
}
exports.arrayToHash = arrayToHash;
function objectToHash(anyObject) {
    return lz_string_1.compressToBase64(JSON.stringify(anyObject));
}
exports.objectToHash = objectToHash;
function hashToArray(hash) {
    const decompressed = lz_string_1.decompressFromBase64(hash);
    const jsArray = JSON.parse("[" + decompressed + "]");
    if (!Array.isArray(jsArray)) {
        throw new Error("Decoded hash should be an array.");
    }
    return jsArray;
}
exports.hashToArray = hashToArray;
function hashToObject(hash) {
    const jsObject = JSON.parse(lz_string_1.decompressFromBase64(hash));
    if (!jsObject || jsObject.constructor !== Object) {
        throw new Error("Decoded hash should be an object.");
    }
    return jsObject;
}
exports.hashToObject = hashToObject;
//# sourceMappingURL=hash-conversions.js.map