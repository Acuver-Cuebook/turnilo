"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
function deserialize(measure) {
    const { description, expression, format, lowerIsBetter, name, title, transformation, units } = measure;
    return {
        description,
        expression: plywood_1.Expression.fromJS(expression),
        format,
        lowerIsBetter,
        name,
        title,
        transformation,
        units
    };
}
exports.deserialize = deserialize;
//# sourceMappingURL=measure.js.map