"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customization_1 = require("./customization");
const oauth_1 = require("./oauth");
function deserialize({ oauth, clientTimeout, customization, version }) {
    return {
        clientTimeout,
        version,
        customization: customization_1.deserialize(customization),
        oauth: oauth_1.deserialize(oauth)
    };
}
exports.deserialize = deserialize;
function serialize(appSettings) {
    const { clientTimeout, version, customization, oauth } = appSettings;
    const { visualizationColors, messages, customLogoSvg, hasUrlShortener, locale, headerBackground, sentryDSN, timezones, externalViews } = customization;
    return {
        clientTimeout,
        version,
        oauth,
        customization: {
            visualizationColors,
            messages,
            customLogoSvg,
            locale,
            hasUrlShortener,
            headerBackground,
            sentryDSN,
            timezones: timezones.map(t => t.toJS()),
            externalViews
        }
    };
}
exports.serialize = serialize;
//# sourceMappingURL=app-settings.js.map