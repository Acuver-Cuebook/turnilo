"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const measures_1 = require("../measure/measures");
const expression_1 = require("./expression");
const defaultExpression = {
    operation: null,
    reference: null
};
class ArithmeticExpression extends immutable_1.Record(defaultExpression) {
    constructor(params) {
        super(params);
    }
    key() {
        return `${this.operation}__${this.reference}`;
    }
    toConcreteExpression(measures) {
        return new ConcreteArithmeticOperation(this.operation, measures_1.findMeasureByName(measures, this.reference));
    }
}
exports.ArithmeticExpression = ArithmeticExpression;
class ConcreteArithmeticOperation {
    constructor(operation, measure) {
        this.operation = operation;
        this.measure = measure;
    }
    operationName() {
        switch (this.operation) {
            case expression_1.ExpressionSeriesOperation.SUBTRACT:
                return "minus";
            case expression_1.ExpressionSeriesOperation.MULTIPLY:
                return "times";
            case expression_1.ExpressionSeriesOperation.DIVIDE:
                return "by";
            case expression_1.ExpressionSeriesOperation.ADD:
                return "plus";
        }
    }
    title() {
        return ` ${this.operationName()} ${this.measure.title}`;
    }
    calculate(a) {
        const operand = this.measure.expression;
        switch (this.operation) {
            case expression_1.ExpressionSeriesOperation.SUBTRACT:
                return a.subtract(operand);
            case expression_1.ExpressionSeriesOperation.MULTIPLY:
                return a.multiply(operand);
            case expression_1.ExpressionSeriesOperation.DIVIDE:
                return a.divide(operand);
            case expression_1.ExpressionSeriesOperation.ADD:
                return a.add(operand);
        }
    }
    toExpression(expression, name, _nestingLevel) {
        return new plywood_1.ApplyExpression({
            name,
            expression: this.calculate(expression)
        });
    }
}
exports.ConcreteArithmeticOperation = ConcreteArithmeticOperation;
//# sourceMappingURL=concreteArithmeticOperation.js.map