"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const settings_manager_1 = require("../utils/settings-manager/settings-manager");
const create_server_1 = __importDefault(require("./create-server"));
function runTurnilo({ serverSettings, sources, appSettings }, anchorPath, verbose, version, program) {
    const settingsManager = new settings_manager_1.SettingsManager(appSettings, sources, {
        anchorPath,
        initialLoadTimeout: serverSettings.pageMustLoadTimeout,
        verbose,
        logger: serverSettings.loggerFormat
    });
    create_server_1.default(serverSettings, app_1.default(serverSettings, settingsManager, version), settingsManager.logger, program);
}
exports.default = runTurnilo;
//# sourceMappingURL=run-turnilo.js.map