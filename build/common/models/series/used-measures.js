"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("../expression/expression");
const series_type_1 = require("./series-type");
function usedMeasuresInExpressionSeries(series) {
    switch (series.expression.operation) {
        case expression_1.ExpressionSeriesOperation.PERCENT_OF_PARENT:
        case expression_1.ExpressionSeriesOperation.PERCENT_OF_TOTAL:
            return [series.reference];
        case expression_1.ExpressionSeriesOperation.ADD:
        case expression_1.ExpressionSeriesOperation.SUBTRACT:
        case expression_1.ExpressionSeriesOperation.MULTIPLY:
        case expression_1.ExpressionSeriesOperation.DIVIDE:
            return [series.reference, series.expression.reference];
    }
}
function usedMeasures(series) {
    switch (series.type) {
        case series_type_1.SeriesType.MEASURE:
            return [series.reference];
        case series_type_1.SeriesType.EXPRESSION:
            return usedMeasuresInExpressionSeries(series);
        case series_type_1.SeriesType.QUANTILE:
            return [series.reference];
    }
}
exports.usedMeasures = usedMeasures;
//# sourceMappingURL=used-measures.js.map