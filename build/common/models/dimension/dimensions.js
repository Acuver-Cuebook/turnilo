"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functional_1 = require("../../utils/functional/functional");
const general_1 = require("../../utils/general/general");
const object_1 = require("../../utils/object/object");
const dimension_1 = require("./dimension");
function isDimensionGroupJS(dimensionOrGroup) {
    return dimensionOrGroup.dimensions !== undefined;
}
function isDimensionId(o) {
    return typeof o === "string";
}
exports.isDimensionId = isDimensionId;
function fromConfig(config) {
    const byName = {};
    function readDimensionOrGroup(dimOrGroup) {
        if (isDimensionGroupJS(dimOrGroup)) {
            const { name, title, description, dimensions } = dimOrGroup;
            if (name == null) {
                throw new Error("dimension group requires a name");
            }
            if (!Array.isArray(dimensions) || dimensions.length === 0) {
                throw new Error(`dimension group '${name}' has no dimensions`);
            }
            return {
                name,
                title: title || general_1.makeTitle(name),
                description,
                dimensions: dimensions.map(readDimensionOrGroup)
            };
        }
        else {
            const dimension = dimension_1.fromConfig(dimOrGroup);
            const { name } = dimension;
            if (general_1.isTruthy(byName[name])) {
                throw new Error(`found duplicate dimension with name: '${name}'`);
            }
            byName[name] = dimension;
            return name;
        }
    }
    const tree = config.map(readDimensionOrGroup);
    return {
        tree,
        byName
    };
}
exports.fromConfig = fromConfig;
function serialize({ tree, byName }) {
    return {
        tree,
        byName: object_1.mapValues(byName, dimension_1.serialize)
    };
}
exports.serialize = serialize;
function allDimensions(dimensions) {
    return functional_1.values(dimensions.byName);
}
exports.allDimensions = allDimensions;
function findDimensionByName(dimensions, name) {
    return dimensions.byName[name] || null;
}
exports.findDimensionByName = findDimensionByName;
function findDimensionByExpression(dimensions, expression) {
    return functional_1.values(dimensions.byName).find(dimension => dimension.expression.equals(expression)) || null;
}
exports.findDimensionByExpression = findDimensionByExpression;
function append(dimension, dimensions) {
    const { name } = dimension;
    return {
        byName: {
            ...dimensions.byName,
            [name]: dimension
        },
        tree: [...dimensions.tree, name]
    };
}
exports.append = append;
function prepend(dimension, dimensions) {
    const { name } = dimension;
    return {
        byName: {
            ...dimensions.byName,
            [name]: dimension
        },
        tree: [name, ...dimensions.tree]
    };
}
exports.prepend = prepend;
//# sourceMappingURL=dimensions.js.map