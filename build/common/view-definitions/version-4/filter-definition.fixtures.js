"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_definition_1 = require("./filter-definition");
function booleanFilterDefinition(ref, values, not = false) {
    return {
        ref,
        type: filter_definition_1.FilterType.boolean,
        not,
        values
    };
}
exports.booleanFilterDefinition = booleanFilterDefinition;
function stringFilterDefinition(ref, action, values, not = false, ignoreCase = false) {
    return {
        ref,
        type: filter_definition_1.FilterType.string,
        action,
        not,
        values,
        ignoreCase
    };
}
exports.stringFilterDefinition = stringFilterDefinition;
function numberRangeFilterDefinition(ref, start, end, bounds = "[)", not = false) {
    return {
        ref,
        type: filter_definition_1.FilterType.number,
        not,
        ranges: [{ start, end, bounds }]
    };
}
exports.numberRangeFilterDefinition = numberRangeFilterDefinition;
function timeRangeFilterDefinition(ref, start, end) {
    return {
        ref,
        type: filter_definition_1.FilterType.time,
        timeRanges: [{ start, end }]
    };
}
exports.timeRangeFilterDefinition = timeRangeFilterDefinition;
function latestTimeFilterDefinition(ref, multiple, duration) {
    return {
        ref,
        type: filter_definition_1.FilterType.time,
        timePeriods: [{ type: "latest", duration, step: multiple }]
    };
}
exports.latestTimeFilterDefinition = latestTimeFilterDefinition;
function flooredTimeFilterDefinition(ref, step, duration) {
    return {
        ref,
        type: filter_definition_1.FilterType.time,
        timePeriods: [{ type: "floored", duration, step }]
    };
}
exports.flooredTimeFilterDefinition = flooredTimeFilterDefinition;
function currentTimeFilterDefinition(ref, duration) {
    return flooredTimeFilterDefinition(ref, 1, duration);
}
exports.currentTimeFilterDefinition = currentTimeFilterDefinition;
function previousTimeFilterDefinition(ref, duration) {
    return flooredTimeFilterDefinition(ref, -1, duration);
}
exports.previousTimeFilterDefinition = previousTimeFilterDefinition;
//# sourceMappingURL=filter-definition.fixtures.js.map