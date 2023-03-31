"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_concrete_series_1 = require("./expression-concrete-series");
const measure_concrete_series_1 = require("./measure-concrete-series");
const quantile_concrete_series_1 = require("./quantile-concrete-series");
const series_type_1 = require("./series-type");
function createConcreteSeries(series, measure, measures) {
    switch (series.type) {
        case series_type_1.SeriesType.MEASURE: {
            return new measure_concrete_series_1.MeasureConcreteSeries(series, measure);
        }
        case series_type_1.SeriesType.EXPRESSION: {
            return new expression_concrete_series_1.ExpressionConcreteSeries(series, measure, measures);
        }
        case series_type_1.SeriesType.QUANTILE: {
            return new quantile_concrete_series_1.QuantileConcreteSeries(series, measure);
        }
    }
}
exports.default = createConcreteSeries;
//# sourceMappingURL=create-concrete-series.js.map