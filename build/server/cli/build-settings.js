"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../common/logger/logger");
const app_settings_1 = require("../../common/models/app-settings/app-settings");
const cluster_1 = require("../../common/models/cluster/cluster");
const data_cube_1 = require("../../common/models/data-cube/data-cube");
const sources_1 = require("../../common/models/sources/sources");
const functional_1 = require("../../common/utils/functional/functional");
const general_1 = require("../../common/utils/general/general");
const object_1 = require("../../common/utils/object/object");
const server_settings_1 = require("../models/server-settings/server-settings");
function overrideClustersAuth(config, auth) {
    if (!config.clusters)
        return config;
    return {
        ...config,
        clusters: config.clusters.map(cluster => ({
            ...cluster,
            auth
        }))
    };
}
function buildSettings(config, options, auth) {
    const definedOptions = object_1.pickValues(options, functional_1.complement(general_1.isNil));
    const serverSettingsJS = {
        ...config,
        ...definedOptions
    };
    const serverSettings = server_settings_1.ServerSettings.fromJS(serverSettingsJS);
    const logger = logger_1.getLogger(serverSettings.loggerFormat);
    const appSettings = app_settings_1.fromConfig(config, logger);
    const sourcesJS = general_1.isNil(auth) ? config : overrideClustersAuth(config, auth);
    const sources = sources_1.fromConfig(sourcesJS, logger);
    return {
        serverSettings,
        appSettings,
        sources
    };
}
exports.default = buildSettings;
function settingsForDruidConnection(url, options, auth) {
    const serverSettings = server_settings_1.ServerSettings.fromJS(options);
    const logger = logger_1.getLogger(serverSettings.loggerFormat);
    const sources = {
        dataCubes: [],
        clusters: [cluster_1.fromConfig({
                name: "druid",
                url,
                auth
            }, logger)]
    };
    const appSettings = app_settings_1.emptySettings(logger_1.getLogger(serverSettings.loggerFormat));
    return {
        sources,
        appSettings,
        serverSettings
    };
}
exports.settingsForDruidConnection = settingsForDruidConnection;
function settingsForDatasetFile(datasetPath, timeAttribute, options) {
    const serverSettings = server_settings_1.ServerSettings.fromJS(options);
    const logger = logger_1.getLogger(serverSettings.loggerFormat);
    const sources = {
        dataCubes: [data_cube_1.fromConfig({
                name: path_1.default.basename(datasetPath, path_1.default.extname(datasetPath)),
                clusterName: "native",
                source: datasetPath,
                timeAttribute
            }, undefined, logger)],
        clusters: []
    };
    const appSettings = app_settings_1.emptySettings(logger_1.getLogger(serverSettings.loggerFormat));
    return {
        sources,
        appSettings,
        serverSettings
    };
}
exports.settingsForDatasetFile = settingsForDatasetFile;
//# sourceMappingURL=build-settings.js.map