"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../general/general");
function noop(...args) {
}
exports.noop = noop;
exports.identity = (x) => x;
exports.constant = (val) => () => val;
exports.compose = (f, g) => (x) => g(f(x));
function cons(coll, element) {
    return coll.concat([element]);
}
exports.cons = cons;
function assoc(coll, key, element) {
    return Object.assign({}, coll, { [key]: element });
}
exports.assoc = assoc;
function replaceAt(collection, index, element) {
    return [
        ...collection.slice(0, index),
        element,
        ...collection.slice(index + 1)
    ];
}
exports.replaceAt = replaceAt;
function zip(xs, ys) {
    const length = Math.min(xs.length, ys.length);
    return xs.slice(0, length).map((x, idx) => {
        const y = ys[idx];
        return [x, y];
    });
}
exports.zip = zip;
function flatMap(coll, mapper) {
    return [].concat(...coll.map(mapper));
}
exports.flatMap = flatMap;
function cyclicShift(coll, count) {
    const n = count % coll.length;
    return coll.slice(n, coll.length).concat(coll.slice(0, n));
}
exports.cyclicShift = cyclicShift;
function concatTruthy(...elements) {
    return elements.reduce((result, element) => general_1.isTruthy(element) ? cons(result, element) : result, []);
}
exports.concatTruthy = concatTruthy;
function mapTruthy(coll, f) {
    return coll.reduce((result, element, idx) => {
        const mapped = f(element, idx);
        return general_1.isTruthy(mapped) ? cons(result, mapped) : result;
    }, []);
}
exports.mapTruthy = mapTruthy;
function values(obj) {
    return Object.keys(obj).map(k => obj[k]);
}
exports.values = values;
function thread(x, ...fns) {
    return fns.reduce((x, f) => f(x), x);
}
exports.thread = thread;
function threadNullable(x, ...fns) {
    return fns.reduce((x, f) => general_1.isTruthy(x) ? f(x) : x, x);
}
exports.threadNullable = threadNullable;
const isCallable = (f) => typeof f === "function";
function threadConditionally(x, ...fns) {
    return fns.reduce((x, f) => isCallable(f) ? f(x) : x, x);
}
exports.threadConditionally = threadConditionally;
function complement(p) {
    return (x) => !p(x);
}
exports.complement = complement;
function or(...ps) {
    return (value) => ps.reduce((acc, p) => p(value) || acc, false);
}
exports.or = or;
function range(from, to) {
    const result = [];
    let n = from;
    while (n < to) {
        result.push(n);
        n += 1;
    }
    return result;
}
exports.range = range;
function debounceWithPromise(fn, ms) {
    let timeoutId;
    const debouncedFn = (...args) => {
        let resolve;
        const promise = new Promise(pResolve => {
            resolve = pResolve;
        });
        const callLater = () => {
            timeoutId = undefined;
            resolve(fn(...args));
        };
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(callLater, ms);
        return promise;
    };
    debouncedFn.cancel = () => timeoutId && clearTimeout(timeoutId);
    return debouncedFn;
}
exports.debounceWithPromise = debounceWithPromise;
//# sourceMappingURL=functional.js.map