"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const module_loader_1 = require("../module-loader/module-loader");
function loadPlugin(pluginPath, anchorPath) {
    const module = module_loader_1.loadModule(pluginPath, anchorPath);
    if (!module || !util_1.isFunction(module.plugin)) {
        throw new Error("Module has no plugin function defined");
    }
    return module;
}
exports.loadPlugin = loadPlugin;
//# sourceMappingURL=load-plugin.js.map