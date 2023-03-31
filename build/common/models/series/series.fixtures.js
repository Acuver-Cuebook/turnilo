"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const measure_series_1 = require("./measure-series");
const quantile_series_1 = require("./quantile-series");
const series_format_1 = require("./series-format");
function measureSeries(reference, format = series_format_1.DEFAULT_FORMAT) {
    return new measure_series_1.MeasureSeries({
        reference,
        format
    });
}
exports.measureSeries = measureSeries;
function quantileSeries(reference, percentile = 95, format = series_format_1.DEFAULT_FORMAT) {
    return new quantile_series_1.QuantileSeries({
        reference,
        percentile,
        format
    });
}
exports.quantileSeries = quantileSeries;
//# sourceMappingURL=series.fixtures.js.map