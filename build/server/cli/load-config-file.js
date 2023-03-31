"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../utils/file/file");
function loadConfigFile(configPath, program) {
    try {
        return file_1.loadFileSync(configPath, "yaml");
    }
    catch (e) {
        program.error(`Loading config file (${configPath}) failed: ${e.message}`);
        return {};
    }
}
exports.loadConfigFile = loadConfigFile;
//# sourceMappingURL=load-config-file.js.map