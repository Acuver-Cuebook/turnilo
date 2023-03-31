"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const general_1 = require("../../utils/general/general");
const expression_series_1 = require("./expression-series");
const measure_series_1 = require("./measure-series");
const quantile_series_1 = require("./quantile-series");
const series_type_1 = require("./series-type");
function fromMeasure(measure) {
    if (measure.expression instanceof plywood_1.QuantileExpression) {
        return quantile_series_1.QuantileSeries.fromQuantileMeasure(measure);
    }
    return measure_series_1.MeasureSeries.fromMeasure(measure);
}
exports.fromMeasure = fromMeasure;
function inferTypeAndConstruct({ expression }, params) {
    if (expression instanceof plywood_1.QuantileExpression) {
        return quantile_series_1.QuantileSeries.fromJS({ ...params, type: series_type_1.SeriesType.QUANTILE });
    }
    return measure_series_1.MeasureSeries.fromJS({ ...params, type: series_type_1.SeriesType.MEASURE });
}
function fromJS(params, measure) {
    const { type } = params;
    if (!general_1.isTruthy(type))
        return inferTypeAndConstruct(measure, params);
    switch (type) {
        case series_type_1.SeriesType.MEASURE:
            return inferTypeAndConstruct(measure, params);
        case series_type_1.SeriesType.EXPRESSION:
            return expression_series_1.ExpressionSeries.fromJS(params);
        case series_type_1.SeriesType.QUANTILE:
            return quantile_series_1.QuantileSeries.fromJS(params);
    }
}
exports.fromJS = fromJS;
//# sourceMappingURL=series.js.map