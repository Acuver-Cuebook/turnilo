"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const functional_1 = require("../../utils/functional/functional");
const general_1 = require("../../utils/general/general");
const colors_1 = require("../colors/colors");
const external_view_1 = require("../external-view/external-view");
const locale_1 = require("../locale/locale");
const url_shortener_1 = require("../url-shortener/url-shortener");
exports.DEFAULT_TITLE = "Turnilo (%v)";
exports.DEFAULT_TIMEZONES = [
    new chronoshift_1.Timezone("America/Juneau"),
    new chronoshift_1.Timezone("America/Los_Angeles"),
    new chronoshift_1.Timezone("America/Yellowknife"),
    new chronoshift_1.Timezone("America/Phoenix"),
    new chronoshift_1.Timezone("America/Denver"),
    new chronoshift_1.Timezone("America/Mexico_City"),
    new chronoshift_1.Timezone("America/Chicago"),
    new chronoshift_1.Timezone("America/New_York"),
    new chronoshift_1.Timezone("America/Argentina/Buenos_Aires"),
    chronoshift_1.Timezone.UTC,
    new chronoshift_1.Timezone("Asia/Jerusalem"),
    new chronoshift_1.Timezone("Europe/Paris"),
    new chronoshift_1.Timezone("Asia/Kolkata"),
    new chronoshift_1.Timezone("Asia/Kathmandu"),
    new chronoshift_1.Timezone("Asia/Hong_Kong"),
    new chronoshift_1.Timezone("Asia/Seoul"),
    new chronoshift_1.Timezone("Pacific/Guam")
];
const availableCssVariables = [
    "background-base",
    "background-brand-light",
    "background-brand-text",
    "background-brand",
    "background-dark",
    "background-light",
    "background-lighter",
    "background-lightest",
    "background-medium",
    "border-darker",
    "border-extra-light",
    "border-light",
    "border-medium",
    "border-super-light",
    "brand-hover",
    "brand-selected",
    "brand",
    "button-primary-active",
    "button-primary-hover",
    "button-secondary-active",
    "button-secondary-hover",
    "button-secondary",
    "button-warn-active",
    "button-warn-hover",
    "button-warn",
    "danger",
    "dark",
    "date-range-picker-selected",
    "drop-area-indicator",
    "error",
    "grid-line-color",
    "highlight-border",
    "highlight",
    "hover",
    "icon-hover",
    "icon-light",
    "item-dimension-hover",
    "item-dimension-text",
    "item-dimension",
    "item-measure-hover",
    "item-measure-text",
    "item-measure",
    "negative",
    "pinboard-icon",
    "positive",
    "text-default-color",
    "text-light",
    "text-lighter",
    "text-lighterish",
    "text-lightest",
    "text-link",
    "text-medium",
    "text-standard"
];
function verifyCssVariables(cssVariables, logger) {
    return Object.keys(cssVariables)
        .filter(variableName => {
        const valid = availableCssVariables.indexOf(variableName) > -1;
        if (!valid) {
            logger.warn(`Unsupported css variables "${variableName}" found.`);
        }
        return valid;
    })
        .reduce((variables, key) => {
        return functional_1.assoc(variables, key, cssVariables[key]);
    }, {});
}
function readVisualizationColors(config) {
    if (general_1.isNil(config.visualizationColors))
        return colors_1.DEFAULT_COLORS;
    return { ...colors_1.DEFAULT_COLORS, ...config.visualizationColors };
}
function fromConfig(config = {}, logger) {
    const { title = exports.DEFAULT_TITLE, headerBackground, customLogoSvg, externalViews: configExternalViews, timezones: configTimezones, urlShortener, sentryDSN, cssVariables = {}, locale, messages = {} } = config;
    const timezones = Array.isArray(configTimezones)
        ? configTimezones.map(chronoshift_1.Timezone.fromJS)
        : exports.DEFAULT_TIMEZONES;
    const externalViews = Array.isArray(configExternalViews)
        ? configExternalViews.map(external_view_1.ExternalView.fromJS)
        : [];
    const visualizationColors = readVisualizationColors(config);
    return {
        title,
        headerBackground,
        customLogoSvg,
        sentryDSN,
        cssVariables: verifyCssVariables(cssVariables, logger),
        urlShortener: url_shortener_1.fromConfig(urlShortener),
        timezones,
        locale: locale_1.fromConfig(locale, logger),
        messages,
        externalViews,
        visualizationColors
    };
}
exports.fromConfig = fromConfig;
function serialize(customization) {
    const { customLogoSvg, timezones, headerBackground, locale, externalViews, sentryDSN, urlShortener, messages, visualizationColors } = customization;
    return {
        customLogoSvg,
        externalViews,
        hasUrlShortener: general_1.isTruthy(urlShortener),
        headerBackground,
        sentryDSN,
        locale: locale_1.serialize(locale),
        timezones: timezones.map(t => t.toJS()),
        messages,
        visualizationColors
    };
}
exports.serialize = serialize;
function getTitle({ title }, version) {
    return title.replace(/%v/g, version);
}
exports.getTitle = getTitle;
//# sourceMappingURL=customization.js.map