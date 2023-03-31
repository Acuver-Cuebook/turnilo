"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_class_1 = require("immutable-class");
const plywood_1 = require("plywood");
const general_1 = require("../../utils/general/general");
const dimension_1 = require("../dimension/dimension");
const dimensions_1 = require("../dimension/dimensions");
const measure_1 = require("../measure/measure");
const measures_1 = require("../measure/measures");
const data_cube_1 = require("./data-cube");
function addAttributes(dataCube, newAttributes) {
    const { attributes, introspection } = dataCube;
    let { dimensions, measures } = dataCube;
    if (introspection === "none")
        return dataCube;
    const autofillDimensions = introspection === "autofill-dimensions-only" || introspection === "autofill-all";
    const autofillMeasures = introspection === "autofill-measures-only" || introspection === "autofill-all";
    const $main = plywood_1.$("main");
    for (const newAttribute of newAttributes) {
        const { name, type, nativeType, maker } = newAttribute;
        if (attributes && immutable_class_1.NamedArray.findByName(attributes, name))
            continue;
        const urlSafeName = general_1.makeUrlSafeName(name);
        if (dimensions_1.findDimensionByName(dataCube.dimensions, urlSafeName) || measures_1.findMeasureByName(dataCube.measures, urlSafeName))
            continue;
        let expression;
        switch (type) {
            case "TIME":
                if (!autofillDimensions)
                    continue;
                expression = plywood_1.$(name);
                if (dimensions_1.findDimensionByExpression(dataCube.dimensions, expression))
                    continue;
                dimensions = dimensions_1.prepend(dimension_1.createDimension("time", urlSafeName, expression), dimensions);
                break;
            case "STRING":
                if (!autofillDimensions)
                    continue;
                expression = plywood_1.$(name);
                if (dimensions_1.findDimensionByExpression(dataCube.dimensions, expression))
                    continue;
                dimensions = dimensions_1.append(dimension_1.createDimension("string", urlSafeName, expression), dimensions);
                break;
            case "SET/STRING":
                if (!autofillDimensions)
                    continue;
                expression = plywood_1.$(name);
                if (dimensions_1.findDimensionByExpression(dataCube.dimensions, expression))
                    continue;
                dimensions = dimensions_1.append(dimension_1.createDimension("string", urlSafeName, expression, true), dimensions);
                break;
            case "BOOLEAN":
                if (!autofillDimensions)
                    continue;
                expression = plywood_1.$(name);
                if (dimensions_1.findDimensionByExpression(dataCube.dimensions, expression))
                    continue;
                dimensions = dimensions_1.append(dimension_1.createDimension("boolean", urlSafeName, expression, true), dimensions);
                break;
            case "NUMBER":
            case "NULL":
                if (!autofillMeasures)
                    continue;
                if (!maker) {
                    expression = plywood_1.$(name);
                    if (dimensions_1.findDimensionByExpression(dataCube.dimensions, expression))
                        continue;
                    dimensions = dimensions_1.append(dimension_1.createDimension("number", urlSafeName, expression, true), dimensions);
                }
                else {
                    const newMeasures = measure_1.measuresFromAttributeInfo(newAttribute);
                    newMeasures.forEach(newMeasure => {
                        if (measures_1.findMeasureByExpression(dataCube.measures, newMeasure.expression))
                            return;
                        measures = (name === "count")
                            ? measures_1.prepend(measures, newMeasure)
                            : measures_1.append(measures, newMeasure);
                    });
                }
                break;
            default:
                throw new Error(`unsupported attribute ${name}; type ${type}, native type ${nativeType}`);
        }
    }
    if (dataCube.clusterName !== "druid" && !measures_1.hasMeasureWithName(measures, "count")) {
        measures = measures_1.prepend(measures, measures_1.createMeasure("count", $main.count()));
    }
    function getTimeAttribute(dimensions) {
        const [first] = dimensions_1.allDimensions(dimensions);
        if (first && first.kind === "time") {
            return first.expression;
        }
        return undefined;
    }
    return {
        ...dataCube,
        dimensions,
        measures,
        attributes: attributes ? plywood_1.AttributeInfo.override(attributes, newAttributes) : newAttributes,
        defaultSortMeasure: data_cube_1.getDefaultSortMeasure(dataCube, measures),
        timeAttribute: dataCube.timeAttribute || getTimeAttribute(dimensions)
    };
}
exports.addAttributes = addAttributes;
function attachDatasetExecutor(dataCube, dataset) {
    if (dataCube.clusterName !== "native")
        throw new Error("must be native to have a dataset");
    const executor = plywood_1.basicExecutorFactory({
        datasets: { main: dataset }
    });
    return {
        ...addAttributes(dataCube, dataset.attributes),
        executor
    };
}
exports.attachDatasetExecutor = attachDatasetExecutor;
function attachExternalExecutor(dataCube, external) {
    if (dataCube.clusterName === "native")
        throw new Error("can not be native and have an external");
    const executor = plywood_1.basicExecutorFactory({
        datasets: { main: external }
    });
    return {
        ...addAttributes(dataCube, external.attributes),
        executor
    };
}
exports.attachExternalExecutor = attachExternalExecutor;
function isQueryable(dataCube) {
    return general_1.hasOwnProperty(dataCube, "executor") && Boolean(dataCube.executor);
}
exports.isQueryable = isQueryable;
//# sourceMappingURL=queryable-data-cube.js.map