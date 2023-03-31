"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function isFilePath(path) {
    return path.startsWith(".") || path.startsWith("/");
}
function normalizeModulePath(modulePath, anchorPath) {
    return isFilePath(modulePath) ? path_1.resolve(anchorPath, modulePath) : modulePath;
}
function loadModule(modulePath, anchorPath) {
    const path = normalizeModulePath(modulePath, anchorPath);
    try {
        return require(path);
    }
    catch (e) {
        throw new Error(`Couldn't load module from path ${path}. Error: ${e.message}`);
    }
}
exports.loadModule = loadModule;
//# sourceMappingURL=module-loader.js.map