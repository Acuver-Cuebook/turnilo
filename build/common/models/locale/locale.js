"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../utils/general/general");
const enUS = {
    shortDays: ["S", "M", "T", "W", "T", "F", "S"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    weekStart: 0,
    exportEncoding: "utf-8"
};
exports.LOCALES = {
    "en-US": enUS
};
const DEFAULT_LOCALE = enUS;
function fromConfig(locale, logger) {
    if (!general_1.isObject(locale))
        return DEFAULT_LOCALE;
    const { base, overrides } = locale;
    if (!general_1.isTruthy(exports.LOCALES[base])) {
        logger.warn(`Unsupported locale identifier: ${base}. Fallback to en-US.`);
        return DEFAULT_LOCALE;
    }
    return {
        ...exports.LOCALES[base],
        ...overrides
    };
}
exports.fromConfig = fromConfig;
function serialize(locale) {
    return locale;
}
exports.serialize = serialize;
function deserialize(locale) {
    return locale;
}
exports.deserialize = deserialize;
//# sourceMappingURL=locale.js.map