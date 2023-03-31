"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const concrete_series_1 = require("./concrete-series");
const measure_series_1 = require("./measure-series");
function fromMeasure(measure) {
    return new MeasureConcreteSeries(measure_series_1.MeasureSeries.fromMeasure(measure), measure);
}
exports.fromMeasure = fromMeasure;
class MeasureConcreteSeries extends concrete_series_1.ConcreteSeries {
    applyExpression(expression, name, nestingLevel) {
        return new plywood_1.ApplyExpression({ expression, name });
    }
}
exports.MeasureConcreteSeries = MeasureConcreteSeries;
//# sourceMappingURL=measure-concrete-series.js.map