"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_helper_1 = require("../../common/utils/yaml-helper/yaml-helper");
const settings_manager_1 = require("../utils/settings-manager/settings-manager");
function printIntrospectedSettings({ serverSettings, sources, appSettings }, withComments, version) {
    const settingsManager = new settings_manager_1.SettingsManager(appSettings, sources, {
        anchorPath: process.cwd(),
        initialLoadTimeout: serverSettings.pageMustLoadTimeout,
        logger: "error"
    });
    return settingsManager.getFreshSources({
        timeout: 10000
    }).then(sources => {
        const config = [
            yaml_helper_1.printExtra({
                header: true,
                version
            }, withComments),
            yaml_helper_1.appSettingsToYaml(appSettings, withComments, settingsManager.logger),
            yaml_helper_1.sourcesToYaml(sources, withComments, settingsManager.logger)
        ];
        process.stdout.write(config.join("\n"));
        process.exit();
    });
}
exports.default = printIntrospectedSettings;
//# sourceMappingURL=introspect-cluster.js.map