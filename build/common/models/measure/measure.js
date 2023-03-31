"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const general_1 = require("../../utils/general/general");
const some_1 = __importDefault(require("../../utils/plywood/some"));
const concrete_series_1 = require("../series/concrete-series");
const series_format_1 = require("../series/series-format");
const measures_1 = require("./measures");
const DEFAULT_FORMAT = series_format_1.measureDefaultFormat;
const DEFAULT_TRANSFORMATION = "none";
const TRANSFORMATIONS = new Set(["none", "percent-of-parent", "percent-of-total"]);
function serialize(measure) {
    return {
        ...measure,
        expression: measure.expression.toJS()
    };
}
exports.serialize = serialize;
function readFormula({ formula, expression, name }) {
    if (formula)
        return plywood_1.Expression.parse(formula);
    if (expression)
        return plywood_1.Expression.parse(expression);
    return plywood_1.$("main").sum(plywood_1.$(name));
}
function verifyName(name) {
    general_1.verifyUrlSafeName(name);
    if (name.startsWith(concrete_series_1.SeriesDerivation.PREVIOUS)) {
        throw new Error(`measure ${name} starts with forbidden prefix: ${concrete_series_1.SeriesDerivation.PREVIOUS}`);
    }
    if (name.startsWith(concrete_series_1.SeriesDerivation.DELTA)) {
        throw new Error(`measure ${name} starts with forbidden prefix: ${concrete_series_1.SeriesDerivation.DELTA}`);
    }
}
function fromConfig(config) {
    const { name, title, units, format, transformation, description, lowerIsBetter } = config;
    verifyName(name);
    if (transformation && !TRANSFORMATIONS.has(transformation)) {
        throw new Error(`Incorrect transformation (${transformation}) for measure ${name}`);
    }
    const expression = readFormula(config);
    return {
        name,
        title: title || general_1.makeTitle(name),
        units,
        format: format || DEFAULT_FORMAT,
        expression,
        description,
        lowerIsBetter: Boolean(lowerIsBetter),
        transformation: transformation || DEFAULT_TRANSFORMATION
    };
}
exports.fromConfig = fromConfig;
function measuresFromAttributeInfo(attribute) {
    const { name, nativeType } = attribute;
    const $main = plywood_1.$("main");
    const ref = plywood_1.$(name);
    if (nativeType) {
        if (nativeType === "hyperUnique" || nativeType === "thetaSketch" || nativeType === "HLLSketch") {
            return [measures_1.createMeasure(general_1.makeUrlSafeName(name), $main.countDistinct(ref))];
        }
        else if (nativeType === "approximateHistogram" || nativeType === "quantilesDoublesSketch") {
            return [measures_1.createMeasure(general_1.makeUrlSafeName(name + "_p98"), $main.quantile(ref, 0.98))];
        }
    }
    let expression = $main.sum(ref);
    const makerAction = attribute.maker;
    if (makerAction) {
        switch (makerAction.op) {
            case "min":
                expression = $main.min(ref);
                break;
            case "max":
                expression = $main.max(ref);
                break;
        }
    }
    return [measures_1.createMeasure(general_1.makeUrlSafeName(name), expression)];
}
exports.measuresFromAttributeInfo = measuresFromAttributeInfo;
function getTitleWithUnits(measure) {
    if (measure.units) {
        return `${measure.title} (${measure.units})`;
    }
    else {
        return measure.title;
    }
}
exports.getTitleWithUnits = getTitleWithUnits;
function hasCountDistinctReferences(ex) {
    return some_1.default(ex, e => e instanceof plywood_1.CountDistinctExpression);
}
function hasQuantileReferences(ex) {
    return some_1.default(ex, e => e instanceof plywood_1.QuantileExpression);
}
function isApproximate(measure) {
    return hasCountDistinctReferences(measure.expression) || hasQuantileReferences(measure.expression);
}
exports.isApproximate = isApproximate;
function isQuantile(measure) {
    return measure.expression instanceof plywood_1.QuantileExpression;
}
exports.isQuantile = isQuantile;
//# sourceMappingURL=measure.js.map