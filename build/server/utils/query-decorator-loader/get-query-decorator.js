"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plywood = __importStar(require("plywood"));
const util_1 = require("util");
const functional_1 = require("../../../common/utils/functional/functional");
const module_loader_1 = require("../module-loader/module-loader");
function loadQueryDecorator(dataCube, { anchorPath, logger }) {
    const definition = dataCube.queryDecorator;
    if (!definition)
        return functional_1.identity;
    try {
        logger.log(`Loading query decorator module for ${dataCube.name}`);
        const module = module_loader_1.loadModule(definition.path, anchorPath);
        if (!module || !util_1.isFunction(module.decorator)) {
            logger.warn(`${dataCube.name} query decorator module has no decorator function defined`);
            return functional_1.identity;
        }
        const decorator = module.decorator;
        return (e, req) => decorator(e, req, definition.options, plywood);
    }
    catch (e) {
        logger.warn(`Couldn't load query decorator for ${dataCube.name}. ${e.message}`);
        return functional_1.identity;
    }
}
function getQueryDecorator(req, dataCube, settings) {
    const decorator = loadQueryDecorator(dataCube, settings);
    return (e) => decorator(e, req);
}
exports.getQueryDecorator = getQueryDecorator;
//# sourceMappingURL=get-query-decorator.js.map