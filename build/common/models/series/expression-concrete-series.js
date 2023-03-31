"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concrete_series_1 = require("./concrete-series");
class ExpressionConcreteSeries extends concrete_series_1.ConcreteSeries {
    constructor(series, measure, measures) {
        super(series, measure);
        this.expression = this.definition.expression.toConcreteExpression(measures);
    }
    reactKey(derivation) {
        return `${super.reactKey(derivation)}-${this.definition.expression.key()}`;
    }
    title(derivation) {
        return `${super.title(derivation)} ${this.expression.title()}`;
    }
    applyExpression(expression, name, nestingLevel) {
        return this.expression.toExpression(expression, name, nestingLevel);
    }
}
exports.ExpressionConcreteSeries = ExpressionConcreteSeries;
//# sourceMappingURL=expression-concrete-series.js.map