"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const constants_1 = require("../../../client/config/constants");
const date_range_1 = require("../../models/date-range/date-range");
const filter_clause_1 = require("../../models/filter-clause/filter-clause");
const general_1 = require("../general/general");
const time_1 = require("../time/time");
function safeFormatNumber(value) {
    return general_1.isNil(value) ? "any" : value.toString(10);
}
function formatNumberRange(value) {
    const start = safeFormatNumber(value.start);
    const end = safeFormatNumber(value.end);
    return `${start} to ${end}`;
}
exports.formatNumberRange = formatNumberRange;
function formatValue(value, timezone) {
    if (plywood_1.NumberRange.isNumberRange(value)) {
        return formatNumberRange(value);
    }
    else if (plywood_1.TimeRange.isTimeRange(value)) {
        return time_1.formatTimeRange(new date_range_1.DateRange(value), timezone);
    }
    else {
        return "" + value;
    }
}
exports.formatValue = formatValue;
function formatShortSegment(value, timezone) {
    if (plywood_1.TimeRange.isTimeRange(value)) {
        return time_1.formatStartOfTimeRange(value, timezone);
    }
    else if (plywood_1.NumberRange.isNumberRange(value)) {
        return value.start.toString(10);
    }
    return String(value);
}
exports.formatShortSegment = formatShortSegment;
function formatSegment(value, timezone) {
    if (plywood_1.TimeRange.isTimeRange(value)) {
        return time_1.formatStartOfTimeRange(value, timezone);
    }
    else if (plywood_1.NumberRange.isNumberRange(value)) {
        return formatNumberRange(value);
    }
    return String(value);
}
exports.formatSegment = formatSegment;
function formatFilterClause(dimension, clause, timezone) {
    const { title, values } = getFormattedClause(dimension, clause, timezone);
    return title ? `${title} ${values}` : values;
}
exports.formatFilterClause = formatFilterClause;
function getFormattedStringClauseValues({ values, action }) {
    switch (action) {
        case filter_clause_1.StringFilterAction.MATCH:
            return `/${values.first()}/`;
        case filter_clause_1.StringFilterAction.CONTAINS:
            return `"${values.first()}"`;
        case filter_clause_1.StringFilterAction.IN:
            return values.count() > 1 ? `(${values.count()})` : String(values.first());
    }
}
function getFormattedBooleanClauseValues({ values }) {
    return values.count() > 1 ? `(${values.count()})` : values.first().toString();
}
function getFormattedNumberClauseValues(clause) {
    const { start, end } = clause.values.first();
    return `${start} to ${end}`;
}
function getFilterClauseValues(clause, timezone) {
    if (filter_clause_1.isTimeFilter(clause)) {
        return getFormattedTimeClauseValues(clause, timezone);
    }
    if (clause instanceof filter_clause_1.StringFilterClause) {
        return getFormattedStringClauseValues(clause);
    }
    if (clause instanceof filter_clause_1.BooleanFilterClause) {
        return getFormattedBooleanClauseValues(clause);
    }
    if (clause instanceof filter_clause_1.NumberFilterClause) {
        return getFormattedNumberClauseValues(clause);
    }
    throw new Error(`Unknown Filter Clause: ${clause}`);
}
function getClauseLabel(clause, dimension) {
    const dimensionTitle = dimension.title;
    if (filter_clause_1.isTimeFilter(clause))
        return "";
    const delimiter = clause instanceof filter_clause_1.StringFilterClause && [filter_clause_1.StringFilterAction.MATCH, filter_clause_1.StringFilterAction.CONTAINS].indexOf(clause.action) !== -1 ? " ~" : ":";
    const clauseValues = clause.values;
    if (clauseValues && clauseValues.count() > 1)
        return `${dimensionTitle}`;
    return `${dimensionTitle}${delimiter}`;
}
function getFormattedClause(dimension, clause, timezone) {
    return { title: getClauseLabel(clause, dimension), values: getFilterClauseValues(clause, timezone) };
}
exports.getFormattedClause = getFormattedClause;
function getFormattedTimeClauseValues(clause, timezone) {
    if (clause instanceof filter_clause_1.FixedTimeFilterClause) {
        return time_1.formatTimeRange(clause.values.get(0), timezone);
    }
    const { period, duration } = clause;
    switch (period) {
        case filter_clause_1.TimeFilterPeriod.PREVIOUS:
            return `${constants_1.STRINGS.previous} ${getQualifiedDurationDescription(duration)}`;
        case filter_clause_1.TimeFilterPeriod.CURRENT:
            return `${constants_1.STRINGS.current} ${getQualifiedDurationDescription(duration)}`;
        case filter_clause_1.TimeFilterPeriod.LATEST:
            return `${constants_1.STRINGS.latest} ${getQualifiedDurationDescription(duration)}`;
    }
}
function getQualifiedDurationDescription(duration) {
    if (duration.toString() === "P3M") {
        return constants_1.STRINGS.quarter.toLowerCase();
    }
    else {
        return duration.getDescription();
    }
}
//# sourceMappingURL=formatter.js.map