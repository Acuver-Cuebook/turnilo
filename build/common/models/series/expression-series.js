"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const expression_1 = require("../expression/expression");
const concrete_series_1 = require("./concrete-series");
const series_format_1 = require("./series-format");
const series_type_1 = require("./series-type");
const defaultSeries = {
    reference: null,
    format: series_format_1.DEFAULT_FORMAT,
    type: series_type_1.SeriesType.EXPRESSION,
    expression: null
};
class ExpressionSeries extends immutable_1.Record(defaultSeries) {
    static fromJS({ type, reference, expression, format }) {
        return new ExpressionSeries({
            type,
            reference,
            expression: expression_1.fromJS(expression),
            format: series_format_1.SeriesFormat.fromJS(format)
        });
    }
    constructor(params) {
        super(params);
    }
    key() {
        return `${this.reference}__${this.expression.key()}`;
    }
    plywoodKey(period = concrete_series_1.SeriesDerivation.CURRENT) {
        return concrete_series_1.getNameWithDerivation(this.key(), period);
    }
}
exports.ExpressionSeries = ExpressionSeries;
//# sourceMappingURL=expression-series.js.map