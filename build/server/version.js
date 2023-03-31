"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const file_1 = require("./utils/file/file");
const PACKAGE_FILE = path_1.default.join(__dirname, "../../package.json");
exports.readVersion = () => {
    const packageObj = file_1.loadFileSync(PACKAGE_FILE, "json");
    if (!("version" in packageObj)) {
        throw new Error("Couldn't read version from package.json");
    }
    return packageObj.version;
};
//# sourceMappingURL=version.js.map