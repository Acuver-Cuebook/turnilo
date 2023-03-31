"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../models/dimension/dimensions");
class Predicates {
    static noSplits() {
        return ({ splits }) => splits.length() === 0;
    }
    static numberOfSplitsIsNot(expected) {
        return ({ splits }) => splits.length() !== expected;
    }
    static numberOfSeriesIsNot(expected) {
        return ({ series }) => series.count() !== expected;
    }
    static areExactSplitKinds(...selectors) {
        return ({ splits, dataCube }) => {
            const kinds = splits.splits.map((split) => dimensions_1.findDimensionByName(dataCube.dimensions, split.reference).kind).toArray();
            return Predicates.strictCompare(selectors, kinds);
        };
    }
    static strictCompare(selectors, kinds) {
        if (selectors.length !== kinds.length)
            return false;
        return selectors.every((selector, i) => Predicates.testKind(kinds[i], selector));
    }
    static testKind(kind, selector) {
        if (selector === "*") {
            return true;
        }
        const bareSelector = selector.replace(/^!/, "");
        const result = kind === bareSelector;
        if (selector.charAt(0) === "!") {
            return !result;
        }
        return result;
    }
    static haveAtLeastSplitKinds(...kinds) {
        return ({ splits, dataCube }) => {
            const getKind = (split) => dimensions_1.findDimensionByName(dataCube.dimensions, split.reference).kind;
            const actualKinds = splits.splits.map(getKind);
            return kinds.every(kind => actualKinds.indexOf(kind) > -1);
        };
    }
    static supportedSplitsCount() {
        return ({ splits, dataCube }) => dataCube.maxSplits < splits.length();
    }
    static noSelectedMeasures() {
        return ({ series }) => series.isEmpty();
    }
}
exports.Predicates = Predicates;
//# sourceMappingURL=predicates.js.map