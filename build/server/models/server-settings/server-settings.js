"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const general_1 = require("../../../common/utils/general/general");
const plugin_settings_1 = require("../plugin-settings/plugin-settings");
exports.DEFAULT_PORT = 9090;
exports.DEFAULT_SERVER_ROOT = "";
exports.DEFAULT_SERVER_HOST = null;
const DEFAULT_READINESS_ENDPOINT = "/health/ready";
const DEFAULT_LIVENESS_ENDPOINT = "/health/alive";
const DEFAULT_SERVER_TIMEOUT = 0;
const DEFAULT_REQUEST_LOG_FORMAT = "common";
const DEFAULT_PAGE_MUST_LOAD_TIMEOUT = 800;
const IFRAME_VALUES = ["allow", "deny"];
const DEFAULT_IFRAME = "allow";
const TRUST_PROXY_VALUES = ["none", "always"];
const DEFAULT_TRUST_PROXY = "none";
const STRICT_TRANSPORT_SECURITY_VALUES = ["none", "always"];
const DEFAULT_STRICT_TRANSPORT_SECURITY = "none";
exports.DEFAULT_LOGGER_FORMAT = "plain";
exports.LOGGER_FORMAT_VALUES = ["plain", "json"];
const defaultServerSettings = {
    iframe: DEFAULT_IFRAME,
    livenessEndpoint: DEFAULT_LIVENESS_ENDPOINT,
    pageMustLoadTimeout: DEFAULT_PAGE_MUST_LOAD_TIMEOUT,
    plugins: [],
    port: exports.DEFAULT_PORT,
    readinessEndpoint: DEFAULT_READINESS_ENDPOINT,
    requestLogFormat: DEFAULT_REQUEST_LOG_FORMAT,
    serverHost: exports.DEFAULT_SERVER_HOST,
    serverRoot: exports.DEFAULT_SERVER_ROOT,
    serverTimeout: DEFAULT_SERVER_TIMEOUT,
    strictTransportSecurity: DEFAULT_STRICT_TRANSPORT_SECURITY,
    trustProxy: DEFAULT_TRUST_PROXY,
    verbose: false,
    loggerFormat: exports.DEFAULT_LOGGER_FORMAT
};
class ServerSettings extends immutable_1.Record(defaultServerSettings) {
    static fromJS(parameters) {
        const { iframe, trustProxy, strictTransportSecurity, livenessEndpoint, pageMustLoadTimeout, requestLogFormat, serverRoot, serverTimeout, serverHost, loggerFormat } = parameters;
        general_1.optionalEnsureOneOf(iframe, IFRAME_VALUES, "ServerSettings: iframe");
        general_1.optionalEnsureOneOf(trustProxy, TRUST_PROXY_VALUES, "ServerSettings: trustProxy");
        general_1.optionalEnsureOneOf(strictTransportSecurity, STRICT_TRANSPORT_SECURITY_VALUES, "ServerSettings: strictTransportSecurity");
        general_1.optionalEnsureOneOf(loggerFormat, exports.LOGGER_FORMAT_VALUES, "ServerSettings: loggerFormat");
        const readinessEndpoint = !parameters.readinessEndpoint && !!parameters.healthEndpoint ? parameters.healthEndpoint : parameters.readinessEndpoint;
        const verbose = Boolean(parameters.verbose);
        const plugins = parameters.plugins && parameters.plugins.map(pluginDefinition => plugin_settings_1.PluginSettings.fromJS(pluginDefinition));
        return new ServerSettings({
            port: typeof parameters.port === "string" ? parseInt(parameters.port, 10) : parameters.port,
            loggerFormat,
            plugins,
            readinessEndpoint,
            livenessEndpoint,
            verbose,
            iframe,
            trustProxy,
            strictTransportSecurity,
            pageMustLoadTimeout,
            requestLogFormat,
            serverHost,
            serverTimeout,
            serverRoot
        });
    }
}
exports.ServerSettings = ServerSettings;
//# sourceMappingURL=server-settings.js.map