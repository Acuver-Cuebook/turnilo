"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const concrete_series_1 = require("./concrete-series");
const series_format_1 = require("./series-format");
const series_type_1 = require("./series-type");
const defaultQuantileSeries = {
    format: series_format_1.DEFAULT_FORMAT,
    percentile: 95,
    reference: null,
    type: series_type_1.SeriesType.QUANTILE
};
class QuantileSeries extends immutable_1.Record(defaultQuantileSeries) {
    static fromJS({ type, reference, percentile, format }) {
        return new QuantileSeries({
            type,
            reference,
            percentile,
            format: series_format_1.SeriesFormat.fromJS(format)
        });
    }
    static fromQuantileMeasure({ name: reference, expression }) {
        if (!(expression instanceof plywood_1.QuantileExpression))
            throw new Error(`Expected QuantileExpression, got ${expression}`);
        return new QuantileSeries({
            reference,
            percentile: expression.value * 100
        });
    }
    constructor(params) {
        super(params);
    }
    formattedPercentile() {
        return this.percentile.toString();
    }
    key() {
        return `${this.reference}__p${this.formattedPercentile()}`;
    }
    plywoodKey(derivation = concrete_series_1.SeriesDerivation.CURRENT) {
        return concrete_series_1.getNameWithDerivation(this.key(), derivation);
    }
}
exports.QuantileSeries = QuantileSeries;
//# sourceMappingURL=quantile-series.js.map