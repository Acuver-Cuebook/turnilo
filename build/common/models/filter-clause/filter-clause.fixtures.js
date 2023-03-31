"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const date_range_1 = require("../date-range/date-range");
const filter_clause_1 = require("./filter-clause");
function stringWithAction(reference, action, values, not = false) {
    if (action !== filter_clause_1.StringFilterAction.IN && values instanceof Array && values.length !== 1) {
        throw new Error(`Unsupported values: ${values} for action: ${action}.`);
    }
    return new filter_clause_1.StringFilterClause({ reference, action, values: immutable_1.Set(values), not });
}
exports.stringWithAction = stringWithAction;
function stringIn(reference, values, not = false) {
    return new filter_clause_1.StringFilterClause({ reference, action: filter_clause_1.StringFilterAction.IN, values: immutable_1.Set(values), not });
}
exports.stringIn = stringIn;
function stringContains(reference, value, not = false) {
    return new filter_clause_1.StringFilterClause({ reference, action: filter_clause_1.StringFilterAction.CONTAINS, values: immutable_1.Set.of(value), not });
}
exports.stringContains = stringContains;
function stringMatch(reference, value, not = false) {
    return new filter_clause_1.StringFilterClause({ reference, action: filter_clause_1.StringFilterAction.MATCH, values: immutable_1.Set.of(value), not });
}
exports.stringMatch = stringMatch;
function boolean(reference, values, not = false) {
    return new filter_clause_1.BooleanFilterClause({ reference, not, values: immutable_1.Set(values) });
}
exports.boolean = boolean;
function numberRange(reference, start, end, bounds = "[)", not = false) {
    return new filter_clause_1.NumberFilterClause({ reference, not, values: immutable_1.List.of(new filter_clause_1.NumberRange({ bounds, start, end })) });
}
exports.numberRange = numberRange;
function timeRange(reference, start, end) {
    return new filter_clause_1.FixedTimeFilterClause({ reference, values: immutable_1.List.of(new date_range_1.DateRange({ start, end })) });
}
exports.timeRange = timeRange;
function timePeriod(reference, duration, period) {
    return new filter_clause_1.RelativeTimeFilterClause({ reference, duration: chronoshift_1.Duration.fromJS(duration), period });
}
exports.timePeriod = timePeriod;
//# sourceMappingURL=filter-clause.fixtures.js.map