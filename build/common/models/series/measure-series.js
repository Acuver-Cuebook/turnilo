"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const concrete_series_1 = require("./concrete-series");
const series_format_1 = require("./series-format");
const series_type_1 = require("./series-type");
const defaultMeasureSeries = {
    reference: null,
    format: series_format_1.DEFAULT_FORMAT,
    type: series_type_1.SeriesType.MEASURE
};
class MeasureSeries extends immutable_1.Record(defaultMeasureSeries) {
    static fromMeasure(measure) {
        return new MeasureSeries({ reference: measure.name });
    }
    static fromJS({ reference, format, type }) {
        return new MeasureSeries({ reference, type, format: series_format_1.SeriesFormat.fromJS(format) });
    }
    constructor(params) {
        super(params);
    }
    key() {
        return this.reference;
    }
    plywoodKey(derivation = concrete_series_1.SeriesDerivation.CURRENT) {
        return concrete_series_1.getNameWithDerivation(this.reference, derivation);
    }
}
exports.MeasureSeries = MeasureSeries;
//# sourceMappingURL=measure-series.js.map