"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const numbro_1 = __importDefault(require("numbro"));
const general_1 = require("../../utils/general/general");
var SeriesFormatType;
(function (SeriesFormatType) {
    SeriesFormatType["DEFAULT"] = "default";
    SeriesFormatType["EXACT"] = "exact";
    SeriesFormatType["PERCENT"] = "percent";
    SeriesFormatType["CUSTOM"] = "custom";
})(SeriesFormatType = exports.SeriesFormatType || (exports.SeriesFormatType = {}));
const defaultFormat = { type: SeriesFormatType.DEFAULT, value: "" };
class SeriesFormat extends immutable_1.Record(defaultFormat) {
    static fromJS(params) {
        return new SeriesFormat(params);
    }
}
exports.SeriesFormat = SeriesFormat;
exports.DEFAULT_FORMAT = new SeriesFormat(defaultFormat);
exports.EXACT_FORMAT = new SeriesFormat({ type: SeriesFormatType.EXACT });
exports.PERCENT_FORMAT = new SeriesFormat({ type: SeriesFormatType.PERCENT });
exports.customFormat = (value) => new SeriesFormat({ type: SeriesFormatType.CUSTOM, value });
function formatFnFactory(format) {
    return (n) => {
        if (!general_1.isNumber(n) || !general_1.isFiniteNumber(n))
            return "-";
        return numbro_1.default(n).format(format);
    };
}
exports.formatFnFactory = formatFnFactory;
exports.exactFormat = "0,0";
const exactFormatter = formatFnFactory(exports.exactFormat);
exports.percentFormat = "0[.]00%";
const percentFormatter = formatFnFactory(exports.percentFormat);
exports.measureDefaultFormat = "0,0.0 a";
exports.defaultFormatter = formatFnFactory(exports.measureDefaultFormat);
function seriesFormatter(format, measure) {
    switch (format.type) {
        case SeriesFormatType.DEFAULT:
            return formatFnFactory(measure.format);
        case SeriesFormatType.EXACT:
            return exactFormatter;
        case SeriesFormatType.PERCENT:
            return percentFormatter;
        case SeriesFormatType.CUSTOM:
            return formatFnFactory(format.value);
    }
}
exports.seriesFormatter = seriesFormatter;
//# sourceMappingURL=series-format.js.map