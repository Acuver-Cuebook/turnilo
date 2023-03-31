"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    }
    catch (e) {
        return undefined;
    }
}
exports.get = get;
function set(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (e) {
    }
}
exports.set = set;
function remove(key) {
    try {
        localStorage.removeItem(key);
    }
    catch (e) {
    }
}
exports.remove = remove;
//# sourceMappingURL=local-storage.js.map