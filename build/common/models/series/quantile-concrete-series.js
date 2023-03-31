"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const concrete_series_1 = require("./concrete-series");
class QuantileConcreteSeries extends concrete_series_1.ConcreteSeries {
    constructor(series, measure) {
        super(series, measure);
    }
    title(derivation) {
        return `${super.title(derivation)} p${this.definition.formattedPercentile()}`;
    }
    applyExpression(quantileExpression, name, nestingLevel) {
        if (!(quantileExpression instanceof plywood_1.QuantileExpression))
            throw new Error(`Expected QuantileExpression, got ${quantileExpression}`);
        const expression = new plywood_1.QuantileExpression({ ...quantileExpression.valueOf(), value: this.definition.percentile / 100 });
        return new plywood_1.ApplyExpression({ name, expression });
    }
}
exports.QuantileConcreteSeries = QuantileConcreteSeries;
//# sourceMappingURL=quantile-concrete-series.js.map