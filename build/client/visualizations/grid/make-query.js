"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const dimensions_1 = require("../../../common/models/dimension/dimensions");
const filter_clause_1 = require("../../../common/models/filter-clause/filter-clause");
const split_1 = require("../../../common/models/split/split");
const query_1 = require("../../../common/utils/canonical-length/query");
const split_canonical_length_1 = __importDefault(require("../../../common/utils/canonical-length/split-canonical-length"));
const time_filter_canonical_length_1 = __importDefault(require("../../../common/utils/canonical-length/time-filter-canonical-length"));
const functional_1 = require("../../../common/utils/functional/functional");
const constants_1 = require("../../config/constants");
const $main = plywood_1.$("main");
function applySeries(series, timeShiftEnv, nestingLevel = 0) {
    return (query) => {
        return series.reduce((query, series) => {
            return query.performAction(series.plywoodExpression(nestingLevel, timeShiftEnv));
        }, query);
    };
}
function applyLimit({ limit: value }) {
    const limitExpression = new plywood_1.LimitExpression({ value });
    return (query) => query.performAction(limitExpression);
}
function applySort(sort) {
    return (query) => query.performAction(sort.toExpression());
}
function applyCanonicalLength(splits, dataCube) {
    return (exp) => {
        const canonicalLength = splits
            .map(split => split_canonical_length_1.default(split, dataCube))
            .filter(length => length !== null)
            .first();
        if (!canonicalLength)
            return exp;
        return exp.apply(query_1.CANONICAL_LENGTH_ID, canonicalLength);
    };
}
function applyDimensionFilter(dimensions, filter) {
    return (query) => {
        return dimensions.reduce((query, dimension) => {
            if (dimension.kind !== "string" || !dimension.multiValue)
                return query;
            const filterClause = filter.clauseForReference(dimension.name);
            if (!filterClause)
                return query;
            return query.filter(filter_clause_1.toExpression(filterClause, dimension));
        }, query);
    };
}
function applySplits(essence, timeShiftEnv) {
    const { splits: { splits }, dataCube, filter } = essence;
    const firstSplit = splits.first();
    const splitsMap = splits.reduce((map, split) => {
        const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.reference);
        const { name } = dimension;
        const expression = split_1.toExpression(split, dimension, timeShiftEnv);
        return functional_1.assoc(map, name, expression);
    }, {});
    const dimensions = splits.map(split => dimensions_1.findDimensionByName(dataCube.dimensions, split.reference));
    return functional_1.thread($main.split(splitsMap), applyDimensionFilter(dimensions, filter), applyCanonicalLength(splits, dataCube), applySeries(essence.getConcreteSeries(), timeShiftEnv), applySort(firstSplit.sort), applyLimit(firstSplit));
}
function makeQuery(essence, timekeeper) {
    const { dataCube } = essence;
    const hasComparison = essence.hasComparison();
    const mainFilter = essence.getEffectiveFilter(timekeeper, { combineWithPrevious: hasComparison });
    const timeShiftEnv = essence.getTimeShiftEnv(timekeeper);
    const mainExp = plywood_1.ply()
        .apply("main", $main.filter(mainFilter.toExpression(dataCube)))
        .apply(query_1.CANONICAL_LENGTH_ID, time_filter_canonical_length_1.default(essence, timekeeper));
    const queryWithMeasures = applySeries(essence.getConcreteSeries(), timeShiftEnv)(mainExp);
    return queryWithMeasures
        .apply(constants_1.SPLIT, applySplits(essence, timeShiftEnv));
}
exports.default = makeQuery;
//# sourceMappingURL=make-query.js.map