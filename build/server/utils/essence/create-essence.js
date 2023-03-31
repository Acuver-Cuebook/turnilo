"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_settings_1 = require("../../../client/deserializers/app-settings");
const app_settings_2 = require("../../../common/models/app-settings/app-settings");
const request_errors_1 = require("../request-errors/request-errors");
function convertToClientAppSettings(appSettings) {
    return app_settings_1.deserialize(app_settings_2.serialize(appSettings));
}
function convertToClientDataCube(cube) {
    return {
        ...cube,
        timeAttribute: cube.timeAttribute && cube.timeAttribute.name
    };
}
function createEssence(viewDefinition, converter, dataCube, appSettings) {
    const clientDataCube = convertToClientDataCube(dataCube);
    const clientAppSettings = convertToClientAppSettings(appSettings);
    try {
        return converter.fromViewDefinition(viewDefinition, clientAppSettings, clientDataCube);
    }
    catch ({ message }) {
        throw new request_errors_1.InvalidRequestError(`invalid viewDefinition object: ${message}`);
    }
}
exports.createEssence = createEssence;
//# sourceMappingURL=create-essence.js.map