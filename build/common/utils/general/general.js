"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const objectHasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(obj, key) {
    if (!obj)
        return false;
    return objectHasOwnProperty.call(obj, key);
}
exports.hasOwnProperty = hasOwnProperty;
function isNil(obj) {
    return obj === undefined || obj === null;
}
exports.isNil = isNil;
function isObject(obj) {
    return obj !== null && typeof obj === "object";
}
exports.isObject = isObject;
function isTruthy(element) {
    return element !== null && element !== undefined && element !== false;
}
exports.isTruthy = isTruthy;
function isBlank(str) {
    return str.length === 0;
}
exports.isBlank = isBlank;
function isNumber(n) {
    return typeof n === "number";
}
exports.isNumber = isNumber;
function isFiniteNumber(n) {
    return isNumber(n) && isFinite(n) && !isNaN(n);
}
exports.isFiniteNumber = isFiniteNumber;
function moveInList(list, itemIndex, insertPoint) {
    const n = list.size;
    if (itemIndex < 0 || itemIndex >= n)
        throw new Error("itemIndex out of range");
    if (insertPoint < 0 || insertPoint > n)
        throw new Error("insertPoint out of range");
    const newArray = [];
    list.forEach((value, i) => {
        if (i === insertPoint)
            newArray.push(list.get(itemIndex));
        if (i !== itemIndex)
            newArray.push(value);
    });
    if (n === insertPoint)
        newArray.push(list.get(itemIndex));
    return immutable_1.List(newArray);
}
exports.moveInList = moveInList;
function makeTitle(name) {
    return name
        .replace(/^[ _\-]+|[ _\-]+$/g, "")
        .replace(/(^|[_\-]+)\w/g, s => {
        return s.replace(/[_\-]+/, " ").toUpperCase();
    })
        .replace(/[a-z0-9][A-Z]/g, s => {
        return s[0] + " " + s[1];
    });
}
exports.makeTitle = makeTitle;
const URL_UNSAFE_CHARS = /[^\w.~\-]+/g;
function makeUrlSafeName(name) {
    return name.replace(URL_UNSAFE_CHARS, "_");
}
exports.makeUrlSafeName = makeUrlSafeName;
function verifyUrlSafeName(name) {
    if (typeof name !== "string")
        throw new TypeError("name must be a string");
    if (!name.length)
        throw new Error("can not have empty name");
    const urlSafeName = makeUrlSafeName(name);
    if (name !== urlSafeName) {
        throw new Error(`'${name}' is not a URL safe name. Try '${urlSafeName}' instead?`);
    }
}
exports.verifyUrlSafeName = verifyUrlSafeName;
function arraySum(inputArray) {
    return inputArray.reduce((pV, cV) => pV + cV, 0);
}
exports.arraySum = arraySum;
function findFirstBiggerIndex(array, elementToFind, valueOf) {
    if (!elementToFind)
        return -1;
    return immutable_1.List(array).findIndex(g => valueOf(g) > valueOf(elementToFind));
}
exports.findFirstBiggerIndex = findFirstBiggerIndex;
function findBiggerClosestToIdeal(array, elementToFind, ideal, valueOf) {
    const biggerOrEqualIndex = immutable_1.List(array).findIndex(g => valueOf(g) >= valueOf(elementToFind));
    const biggerArrayOrEqual = array.slice(biggerOrEqualIndex);
    return biggerArrayOrEqual.reduce((pV, cV) => Math.abs(valueOf(pV) - valueOf(ideal)) < Math.abs(valueOf(cV) - valueOf(ideal)) ? pV : cV);
}
exports.findBiggerClosestToIdeal = findBiggerClosestToIdeal;
function findExactIndex(array, elementToFind, valueOf) {
    return immutable_1.List(array).findIndex(g => valueOf(g) === valueOf(elementToFind));
}
exports.findExactIndex = findExactIndex;
function findMaxValueIndex(array, valueOf) {
    return array.reduce((currMax, cV, cIdx, arr) => valueOf(cV) > valueOf(arr[currMax]) ? cIdx : currMax, 0);
}
exports.findMaxValueIndex = findMaxValueIndex;
function findMinValueIndex(array, valueOf) {
    return array.reduce((currMax, cV, cIdx, arr) => valueOf(cV) < valueOf(arr[currMax]) ? cIdx : currMax, 0);
}
exports.findMinValueIndex = findMinValueIndex;
function log10(n) {
    return Math.log(n) * Math.LOG10E;
}
function integerDivision(x, y) {
    return Math.floor(x / y);
}
exports.integerDivision = integerDivision;
function toSignificantDigits(n, digits) {
    const multiplier = Math.pow(10, digits - Math.floor(Math.log(n) / Math.LN10) - 1);
    return Math.round(n * multiplier) / multiplier;
}
exports.toSignificantDigits = toSignificantDigits;
function getNumberOfWholeDigits(n) {
    return Math.max(Math.floor(log10(Math.abs(n))), 0) + 1;
}
exports.getNumberOfWholeDigits = getNumberOfWholeDigits;
function inlineVars(obj, vs) {
    return JSON.parse(JSON.stringify(obj).replace(/%{[\w\-]+}%/g, varName => {
        varName = varName.substr(2, varName.length - 4);
        let v = vs[varName];
        if (typeof v !== "string")
            throw new Error(`could not find variable '${varName}'`);
        v = JSON.stringify(v);
        return v.substr(1, v.length - 2);
    }));
}
exports.inlineVars = inlineVars;
function ensureOneOf(value, values, messagePrefix) {
    if (values.indexOf(value) !== -1)
        return;
    const isMessage = isTruthy(value) ? `'${value}'` : "not defined";
    throw new Error(`${messagePrefix} must be one of '${values.join("', '")}' (is ${isMessage})`);
}
exports.ensureOneOf = ensureOneOf;
function optionalEnsureOneOf(value, values, messagePrefix) {
    if (!isTruthy(value))
        return;
    if (values.indexOf(value) !== -1)
        return;
    throw new Error(`${messagePrefix} must be one of '${values.join("', '")}' (is '${value}')`);
}
exports.optionalEnsureOneOf = optionalEnsureOneOf;
function pluralIfNeeded(n, thing) {
    return `${n} ${thing}${n === 1 ? "" : "s"}`;
}
exports.pluralIfNeeded = pluralIfNeeded;
function quoteNames(names) {
    return names.map(name => `'${name}'`).join(", ");
}
exports.quoteNames = quoteNames;
function isDecimalInteger(input) {
    return parseInt(input, 10) === Number(input);
}
exports.isDecimalInteger = isDecimalInteger;
function readNumber(input) {
    return typeof input === "number" ? input : parseFloat(input);
}
exports.readNumber = readNumber;
//# sourceMappingURL=general.js.map