"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_class_1 = require("immutable-class");
const plywood_1 = require("plywood");
const dimensions_1 = require("../../models/dimension/dimensions");
const measure_1 = require("../../models/measure/measure");
const measures_1 = require("../../models/measure/measures");
function getReferences(ex) {
    let references = [];
    ex.forEach((sub) => {
        if (sub instanceof plywood_1.RefExpression && sub.name !== "main") {
            references = references.concat(sub.name);
        }
    });
    return plywood_1.deduplicateSort(references);
}
function deduceAttributes(dataCube) {
    const { dimensions, measures, timeAttribute, attributeOverrides } = dataCube;
    let attributes = [];
    if (timeAttribute) {
        attributes.push(plywood_1.AttributeInfo.fromJS({ name: timeAttribute.name, type: "TIME" }));
    }
    dimensions_1.allDimensions(dimensions).forEach(dimension => {
        const expression = dimension.expression;
        if (expression.equals(timeAttribute))
            return;
        const references = expression.getFreeReferences();
        for (const reference of references) {
            if (immutable_class_1.NamedArray.findByName(attributes, reference))
                continue;
            attributes.push(plywood_1.AttributeInfo.fromJS({ name: reference, type: "STRING" }));
        }
    });
    measures_1.allMeasures(measures).forEach(measure => {
        const references = getReferences(measure.expression);
        for (const reference of references) {
            if (immutable_class_1.NamedArray.findByName(attributes, reference))
                continue;
            if (measure_1.isApproximate(measure))
                continue;
            attributes.push(plywood_1.AttributeInfo.fromJS({ name: reference, type: "NUMBER" }));
        }
    });
    if (attributeOverrides.length) {
        attributes = plywood_1.AttributeInfo.override(attributes, attributeOverrides);
    }
    return attributes;
}
exports.deduceAttributes = deduceAttributes;
function dataCubeToExternal(dataCube) {
    if (dataCube.clusterName === "native")
        throw new Error("there is no external on a native data cube");
    const { cluster, options } = dataCube;
    if (!cluster)
        throw new Error("must have a cluster");
    const externalValue = {
        engine: cluster.type,
        suppress: true,
        source: dataCube.source,
        version: cluster.version,
        derivedAttributes: dataCube.derivedAttributes,
        customAggregations: options.customAggregations,
        customTransforms: options.customTransforms,
        filter: dataCube.subsetExpression
    };
    if (cluster.type === "druid") {
        externalValue.rollup = dataCube.rollup;
        externalValue.timeAttribute = dataCube.timeAttribute.name;
        externalValue.introspectionStrategy = cluster.introspectionStrategy;
        externalValue.allowSelectQueries = true;
        const externalContext = {
            timeout: cluster.timeout,
            ...options.druidContext
        };
        externalValue.context = externalContext;
    }
    if (dataCube.introspection === "none") {
        externalValue.attributes = plywood_1.AttributeInfo.override(deduceAttributes(dataCube), dataCube.attributeOverrides);
        externalValue.derivedAttributes = dataCube.derivedAttributes;
    }
    else {
        externalValue.attributeOverrides = dataCube.attributeOverrides;
    }
    return plywood_1.External.fromValue(externalValue);
}
exports.default = dataCubeToExternal;
//# sourceMappingURL=datacube-to-external.js.map