"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
function loadFileSync(filepath, postProcess) {
    const fileData = fs.readFileSync(filepath, "utf-8");
    switch (postProcess) {
        case "json":
            return JSON.parse(fileData);
        case "yaml":
            return yaml.load(fileData);
    }
}
exports.loadFileSync = loadFileSync;
//# sourceMappingURL=file.js.map