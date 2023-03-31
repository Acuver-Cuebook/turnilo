"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const expression_1 = require("./expression");
const defaultPercentOf = {
    operation: null
};
class PercentExpression extends immutable_1.Record(defaultPercentOf) {
    constructor(params) {
        super(params);
    }
    key() {
        return this.operation;
    }
    toConcreteExpression(_measures) {
        return new ConcretePercentExpression(this.operation);
    }
}
exports.PercentExpression = PercentExpression;
class ConcretePercentExpression {
    constructor(operation) {
        this.operation = operation;
    }
    relativeNesting(nestingLevel) {
        switch (this.operation) {
            case expression_1.ExpressionSeriesOperation.PERCENT_OF_TOTAL:
                return nestingLevel;
            case expression_1.ExpressionSeriesOperation.PERCENT_OF_PARENT:
                return Math.min(nestingLevel, 1);
        }
    }
    toExpression(expression, name, nestingLevel) {
        const relativeNesting = this.relativeNesting(nestingLevel);
        const formulaName = `__formula_${name}`;
        if (relativeNesting < 0)
            throw new Error(`wrong nesting level: ${relativeNesting}`);
        return new plywood_1.ApplyExpression({
            name,
            operand: new plywood_1.ApplyExpression({ expression, name: formulaName }),
            expression: plywood_1.$(formulaName).divide(plywood_1.$(formulaName, relativeNesting)).fallback(0)
        });
    }
    title() {
        switch (this.operation) {
            case expression_1.ExpressionSeriesOperation.PERCENT_OF_PARENT:
                return "(% of Parent)";
            case expression_1.ExpressionSeriesOperation.PERCENT_OF_TOTAL:
                return "(% of Total)";
        }
    }
}
exports.ConcretePercentExpression = ConcretePercentExpression;
//# sourceMappingURL=percent.js.map