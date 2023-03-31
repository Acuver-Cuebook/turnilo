"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const locale_1 = require("../../common/models/locale/locale");
function deserialize(customization) {
    const { headerBackground, messages, locale, customLogoSvg, timezones, externalViews, hasUrlShortener, sentryDSN, visualizationColors } = customization;
    return {
        headerBackground,
        customLogoSvg,
        externalViews,
        hasUrlShortener,
        sentryDSN,
        messages,
        locale: locale_1.deserialize(locale),
        timezones: timezones.map(chronoshift_1.Timezone.fromJS),
        visualizationColors
    };
}
exports.deserialize = deserialize;
//# sourceMappingURL=customization.js.map