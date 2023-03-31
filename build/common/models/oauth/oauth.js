"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEnabled(oauth) {
    return oauth.status === "enabled";
}
exports.isEnabled = isEnabled;
function fromConfig(config) {
    if (!config)
        return { status: "disabled" };
    return {
        status: "enabled",
        ...config
    };
}
exports.fromConfig = fromConfig;
function serialize(oauth) {
    return oauth;
}
exports.serialize = serialize;
//# sourceMappingURL=oauth.js.map