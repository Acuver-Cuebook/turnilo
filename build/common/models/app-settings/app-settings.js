"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customization_1 = require("../customization/customization");
const oauth_1 = require("../oauth/oauth");
const DEFAULT_CLIENT_TIMEOUT = 0;
function fromConfig(config, logger) {
    const clientTimeout = config.clientTimeout === undefined ? DEFAULT_CLIENT_TIMEOUT : config.clientTimeout;
    const version = config.version || 0;
    const customization = customization_1.fromConfig(config.customization, logger);
    const oauth = oauth_1.fromConfig(config.oauth);
    return {
        clientTimeout,
        version,
        customization,
        oauth
    };
}
exports.fromConfig = fromConfig;
exports.emptySettings = (logger) => fromConfig({}, logger);
function serialize({ oauth, clientTimeout, customization, version }) {
    return {
        clientTimeout,
        version,
        customization: customization_1.serialize(customization),
        oauth: oauth_1.serialize(oauth)
    };
}
exports.serialize = serialize;
//# sourceMappingURL=app-settings.js.map