"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concreteArithmeticOperation_1 = require("./concreteArithmeticOperation");
const percent_1 = require("./percent");
var ExpressionSeriesOperation;
(function (ExpressionSeriesOperation) {
    ExpressionSeriesOperation["PERCENT_OF_PARENT"] = "percent_of_parent";
    ExpressionSeriesOperation["PERCENT_OF_TOTAL"] = "percent_of_total";
    ExpressionSeriesOperation["SUBTRACT"] = "subtract";
    ExpressionSeriesOperation["ADD"] = "add";
    ExpressionSeriesOperation["MULTIPLY"] = "multiply";
    ExpressionSeriesOperation["DIVIDE"] = "divide";
})(ExpressionSeriesOperation = exports.ExpressionSeriesOperation || (exports.ExpressionSeriesOperation = {}));
function fromJS(params) {
    const { operation } = params;
    switch (operation) {
        case ExpressionSeriesOperation.PERCENT_OF_TOTAL:
        case ExpressionSeriesOperation.PERCENT_OF_PARENT:
            return new percent_1.PercentExpression({ operation });
        case ExpressionSeriesOperation.SUBTRACT:
        case ExpressionSeriesOperation.ADD:
        case ExpressionSeriesOperation.MULTIPLY:
        case ExpressionSeriesOperation.DIVIDE:
            const reference = params.reference;
            return new concreteArithmeticOperation_1.ArithmeticExpression({ operation, reference });
    }
}
exports.fromJS = fromJS;
//# sourceMappingURL=expression.js.map