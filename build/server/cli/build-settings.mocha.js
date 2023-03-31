"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const plywood_1 = require("plywood");
const sinon_1 = __importDefault(require("sinon"));
const equivalent_1 = __importDefault(require("../../client/utils/test-utils/equivalent"));
const logger_1 = require("../../common/logger/logger");
const SourcesModule = __importStar(require("../../common/models/app-settings/app-settings"));
const app_settings_1 = require("../../common/models/app-settings/app-settings");
const cluster_1 = require("../../common/models/cluster/cluster");
const AppSettingsModule = __importStar(require("../../common/models/sources/sources"));
const server_settings_1 = require("../models/server-settings/server-settings");
const build_settings_1 = __importStar(require("./build-settings"));
chai_1.use(equivalent_1.default);
describe("Build Settings", () => {
    describe("settingsForDatasetFile", () => {
        const settings = build_settings_1.settingsForDatasetFile("path/to/file.json", "time", {
            verbose: true,
            port: 42,
            serverHost: "foobar",
            serverRoot: "qvux"
        });
        it("should create empty app settings", () => {
            chai_1.expect(settings.appSettings).to.be.deep.equal(app_settings_1.emptySettings(logger_1.NOOP_LOGGER));
        });
        it("should create empty cluster array", () => {
            chai_1.expect(settings.sources.clusters).to.be.deep.equal([]);
        });
        it("should pass options to server settings constructor and create object", () => {
            chai_1.expect(settings.serverSettings).to.be.equivalent(server_settings_1.ServerSettings.fromJS({
                verbose: true,
                port: 42,
                serverHost: "foobar",
                serverRoot: "qvux"
            }));
        });
        it("should create one data cube", () => {
            chai_1.expect(settings.sources.dataCubes.length).to.be.equal(1);
        });
        it("should pass path as source to data cube", () => {
            chai_1.expect(settings.sources.dataCubes[0].source).to.be.equal("path/to/file.json");
        });
        it("should set filename as data cube name", () => {
            chai_1.expect(settings.sources.dataCubes[0].name).to.be.equal("file");
        });
        it("should set data cube cluster name to 'native'", () => {
            chai_1.expect(settings.sources.dataCubes[0].clusterName).to.be.equal("native");
        });
        it("should pass time attribute to data cube", () => {
            chai_1.expect(settings.sources.dataCubes[0].timeAttribute).to.be.equivalent(plywood_1.RefExpression.fromJS({
                name: "time"
            }));
        });
    });
    describe("settingsForDruidConnection", () => {
        const settings = build_settings_1.settingsForDruidConnection("http://druid-url.com", {
            verbose: true,
            port: 42,
            serverHost: "foobar",
            serverRoot: "qvux"
        }, {
            type: "http-basic",
            password: "secret",
            username: "foobar"
        });
        it("should create empty app settings", () => {
            chai_1.expect(settings.appSettings).to.be.deep.equal(app_settings_1.emptySettings(logger_1.NOOP_LOGGER));
        });
        it("should create empty data cubes array", () => {
            chai_1.expect(settings.sources.dataCubes).to.be.deep.equal([]);
        });
        it("should pass options to server settings constructor and create object", () => {
            chai_1.expect(settings.serverSettings).to.be.equivalent(server_settings_1.ServerSettings.fromJS({
                verbose: true,
                port: 42,
                serverHost: "foobar",
                serverRoot: "qvux"
            }));
        });
        it("should create one cluster", () => {
            chai_1.expect(settings.sources.clusters.length).to.be.equal(1);
        });
        it("should pass url to cluster", () => {
            chai_1.expect(settings.sources.clusters[0].url).to.be.equal("http://druid-url.com");
        });
        it("should set 'druid' as cluster name", () => {
            chai_1.expect(settings.sources.clusters[0].name).to.be.equal("druid");
        });
        it("should pass auth to cluster", () => {
            chai_1.expect(settings.sources.clusters[0].auth).to.be.deep.equal({
                type: "http-basic",
                password: "secret",
                username: "foobar"
            });
        });
    });
    describe("buildSettings", () => {
        it("should pass config to AppSettings fromConfig function", () => {
            const appSettingsFromConfigStub = sinon_1.default.stub(AppSettingsModule, "fromConfig").returns("app-settings");
            build_settings_1.default({ config: true }, {});
            chai_1.expect(appSettingsFromConfigStub.calledWith({ config: true })).to.be.true;
            appSettingsFromConfigStub.restore();
        });
        it("should pass config to Sources fromConfig function", () => {
            const sourcesFromConfigStub = sinon_1.default.stub(SourcesModule, "fromConfig").returns("sources");
            build_settings_1.default({ config: true }, {});
            chai_1.expect(sourcesFromConfigStub.calledWith({ config: true })).to.be.true;
            sourcesFromConfigStub.restore();
        });
        it("should pass merged config and options to ServerSettings.fromJS", () => {
            const serverSettingsFromJSSStub = sinon_1.default.stub(server_settings_1.ServerSettings, "fromJS").returns("server-settings");
            build_settings_1.default({ config: true }, { options: true });
            chai_1.expect(serverSettingsFromJSSStub.calledWith({ config: true, options: true })).to.be.true;
            serverSettingsFromJSSStub.restore();
        });
        it("should pass auth object to all clusters", () => {
            const makeCluster = (name) => cluster_1.fromConfig({ name, url: `https://${name}.com` }, logger_1.NOOP_LOGGER);
            const settings = build_settings_1.default({
                clusters: [makeCluster("foobar-1"), makeCluster("foobar-2")]
            }, {}, { type: "http-basic", password: "secret", username: "foobar" });
            chai_1.expect(settings.sources.clusters[0].auth).to.be.deep.equal({
                type: "http-basic", password: "secret", username: "foobar"
            });
            chai_1.expect(settings.sources.clusters[1].auth).to.be.deep.equal({
                type: "http-basic", password: "secret", username: "foobar"
            });
        });
    });
});
//# sourceMappingURL=build-settings.mocha.js.map