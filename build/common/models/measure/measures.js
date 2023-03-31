"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functional_1 = require("../../utils/functional/functional");
const general_1 = require("../../utils/general/general");
const object_1 = require("../../utils/object/object");
const series_format_1 = require("../series/series-format");
const measure_1 = require("./measure");
function isMeasure(o) {
    return typeof o === "string";
}
exports.isMeasure = isMeasure;
function isMeasureGroupJS(measureOrGroupJS) {
    return measureOrGroupJS.measures !== undefined;
}
exports.isMeasureGroupJS = isMeasureGroupJS;
function fromConfig(config) {
    const byName = {};
    function readMeasureOrGroup(measureOrGroup) {
        if (isMeasureGroupJS(measureOrGroup)) {
            const { name, title, description, measures } = measureOrGroup;
            if (name == null) {
                throw new Error("measure group requires a name");
            }
            if (!Array.isArray(measures) || measures.length === 0) {
                throw new Error(`measure group '${name}' has no measures`);
            }
            return {
                name,
                title: title || general_1.makeTitle(name),
                description,
                measures: measures.map(readMeasureOrGroup)
            };
        }
        else {
            const measure = measure_1.fromConfig(measureOrGroup);
            const { name } = measure;
            if (general_1.isTruthy(byName[name])) {
                throw new Error(`found duplicate measure with name: '${name}'`);
            }
            byName[name] = measure;
            return name;
        }
    }
    const tree = config.map(readMeasureOrGroup);
    return {
        tree,
        byName
    };
}
exports.fromConfig = fromConfig;
function serialize({ tree, byName }) {
    return {
        tree,
        byName: object_1.mapValues(byName, measure_1.serialize)
    };
}
exports.serialize = serialize;
function allMeasures(measures) {
    return functional_1.values(measures.byName);
}
exports.allMeasures = allMeasures;
function findMeasureByName(measures, measureName) {
    return measures.byName[measureName] || null;
}
exports.findMeasureByName = findMeasureByName;
function hasMeasureWithName(measures, measureName) {
    return general_1.isTruthy(findMeasureByName(measures, measureName));
}
exports.hasMeasureWithName = hasMeasureWithName;
function findMeasureByExpression(measures, expression) {
    return functional_1.values(measures.byName).find(measure => measure.expression.equals(expression)) || null;
}
exports.findMeasureByExpression = findMeasureByExpression;
function append(measures, measure) {
    const { name } = measure;
    return {
        byName: {
            ...measures.byName,
            [name]: measure
        },
        tree: [...measures.tree, name]
    };
}
exports.append = append;
function prepend(measures, measure) {
    const { name } = measure;
    return {
        byName: {
            ...measures.byName,
            [name]: measure
        },
        tree: [name, ...measures.tree]
    };
}
exports.prepend = prepend;
function createMeasure(name, expression) {
    return {
        format: series_format_1.measureDefaultFormat,
        lowerIsBetter: false,
        transformation: "none",
        name,
        title: general_1.makeTitle(name),
        expression
    };
}
exports.createMeasure = createMeasure;
//# sourceMappingURL=measures.js.map