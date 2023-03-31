"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("../colors/colors");
const locale_1 = require("../locale/locale");
exports.clientAppSettings = {
    version: 1,
    customization: {
        hasUrlShortener: false,
        externalViews: [],
        timezones: [],
        locale: locale_1.LOCALES["en-US"],
        messages: {},
        visualizationColors: colors_1.DEFAULT_COLORS
    },
    oauth: { status: "disabled" },
    clientTimeout: 1000
};
exports.appSettings = {
    clientTimeout: 1000,
    customization: {
        timezones: [],
        locale: locale_1.LOCALES["en-US"],
        externalViews: [],
        cssVariables: {},
        messages: {},
        visualizationColors: colors_1.DEFAULT_COLORS
    },
    oauth: { status: "disabled" },
    version: 0
};
//# sourceMappingURL=app-settings.fixtures.js.map