"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const constants_1 = require("../../../client/config/constants");
const split_1 = require("../../../common/models/split/split");
const dimensions_1 = require("../../models/dimension/dimensions");
const filter_clause_1 = require("../../models/filter-clause/filter-clause");
const query_1 = require("../canonical-length/query");
const split_canonical_length_1 = __importDefault(require("../canonical-length/split-canonical-length"));
const time_filter_canonical_length_1 = __importDefault(require("../canonical-length/time-filter-canonical-length"));
const functional_1 = require("../functional/functional");
const $main = plywood_1.$("main");
function applySeries(series, timeShiftEnv, nestingLevel = 0) {
    return (query) => {
        return series.reduce((query, series) => {
            return query.performAction(series.plywoodExpression(nestingLevel, timeShiftEnv));
        }, query);
    };
}
function applySort(sort) {
    return (query) => query.performAction(sort.toExpression());
}
function applyLimit(limit, dimension) {
    return (query) => {
        if (limit) {
            return query.performAction(new plywood_1.LimitExpression({ value: limit }));
        }
        if (dimension.kind === "number") {
            return query.limit(5000);
        }
        return query;
    };
}
function applySubSplit(nestingLevel, essence, timeShiftEnv) {
    return (query) => {
        if (nestingLevel >= essence.splits.length())
            return query;
        return query.apply(constants_1.SPLIT, applySplit(nestingLevel, essence, timeShiftEnv));
    };
}
function applyCanonicalLengthForTimeSplit(split, dataCube) {
    return (exp) => {
        const canonicalLength = split_canonical_length_1.default(split, dataCube);
        if (!canonicalLength)
            return exp;
        return exp.apply(query_1.CANONICAL_LENGTH_ID, canonicalLength);
    };
}
function applyDimensionFilter(dimension, filter) {
    return (query) => {
        if (dimension.kind !== "string" || !dimension.multiValue)
            return query;
        const filterClause = filter.clauseForReference(dimension.name);
        if (!filterClause)
            return query;
        return query.filter(filter_clause_1.toExpression(filterClause, dimension));
    };
}
function applySplit(index, essence, timeShiftEnv) {
    const { splits, dataCube } = essence;
    const split = splits.getSplit(index);
    const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.reference);
    const { sort, limit } = split;
    if (!sort) {
        throw new Error("something went wrong during query generation");
    }
    const nestingLevel = index + 1;
    const currentSplit = split_1.toExpression(split, dimension, timeShiftEnv);
    return functional_1.thread($main.split(currentSplit, dimension.name), applyDimensionFilter(dimension, essence.filter), applyCanonicalLengthForTimeSplit(split, dataCube), applySeries(essence.getConcreteSeries(), timeShiftEnv, nestingLevel), applySort(sort), applyLimit(limit, dimension), applySubSplit(nestingLevel, essence, timeShiftEnv));
}
function makeQuery(essence, timekeeper) {
    const { splits, dataCube } = essence;
    if (splits.length() > dataCube.maxSplits)
        throw new Error(`Too many splits in query. DataCube "${dataCube.name}" supports only ${dataCube.maxSplits} splits`);
    const hasComparison = essence.hasComparison();
    const mainFilter = essence.getEffectiveFilter(timekeeper, { combineWithPrevious: hasComparison });
    const timeShiftEnv = essence.getTimeShiftEnv(timekeeper);
    const mainExp = plywood_1.ply()
        .apply("main", $main.filter(mainFilter.toExpression(dataCube)))
        .apply(query_1.CANONICAL_LENGTH_ID, time_filter_canonical_length_1.default(essence, timekeeper));
    const queryWithMeasures = applySeries(essence.getConcreteSeries(), timeShiftEnv)(mainExp);
    if (splits.length() > 0) {
        return queryWithMeasures
            .apply(constants_1.SPLIT, applySplit(0, essence, timeShiftEnv));
    }
    return queryWithMeasures;
}
exports.default = makeQuery;
//# sourceMappingURL=visualization-query.js.map