"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const filter_clause_1 = require("../../../../common/models/filter-clause/filter-clause");
const time_1 = require("../../../../common/models/time/time");
const general_1 = require("../../../../common/utils/general/general");
const $MAX_TIME = plywood_1.$(time_1.MAX_TIME_REF_NAME);
const $NOW = plywood_1.$(time_1.NOW_REF_NAME);
exports.CURRENT_PRESETS = [
    { name: "D", duration: "P1D" },
    { name: "W", duration: "P1W" },
    { name: "M", duration: "P1M" },
    { name: "Q", duration: "P3M" },
    { name: "Y", duration: "P1Y" }
];
exports.PREVIOUS_PRESETS = [
    { name: "D", duration: "P1D" },
    { name: "W", duration: "P1W" },
    { name: "M", duration: "P1M" },
    { name: "Q", duration: "P3M" },
    { name: "Y", duration: "P1Y" }
];
exports.DEFAULT_TIME_SHIFT_DURATIONS = [
    "P1D", "P1W", "P1M", "P3M"
];
exports.DEFAULT_LATEST_PERIOD_DURATIONS = [
    "PT1H", "PT6H", "P1D", "P7D", "P30D"
];
const SINGLE_COMPONENT_DURATION = /^PT?(\d+)([YMWDHS])$/;
const MULTI_COMPONENT_DURATION = /^PT?([\dTYMWDHS]+)$/;
function normalizeDurationName(duration) {
    const singleComponent = duration.match(SINGLE_COMPONENT_DURATION);
    if (general_1.isTruthy(singleComponent)) {
        const [, count, period] = singleComponent;
        if (count === "1")
            return period;
        return `${count}${period}`;
    }
    const multiComponent = duration.match(MULTI_COMPONENT_DURATION);
    if (general_1.isTruthy(multiComponent)) {
        const [, periods] = multiComponent;
        return periods;
    }
    return duration;
}
exports.normalizeDurationName = normalizeDurationName;
function constructFilter(period, duration) {
    switch (period) {
        case filter_clause_1.TimeFilterPeriod.PREVIOUS:
            return $NOW.timeFloor(duration).timeRange(duration, -1);
        case filter_clause_1.TimeFilterPeriod.LATEST:
            return $MAX_TIME.timeRange(duration, -1);
        case filter_clause_1.TimeFilterPeriod.CURRENT:
            return $NOW.timeFloor(duration).timeRange(duration, 1);
        default:
            return null;
    }
}
exports.constructFilter = constructFilter;
function getTimeFilterPresets(period) {
    switch (period) {
        case filter_clause_1.TimeFilterPeriod.PREVIOUS:
            return exports.PREVIOUS_PRESETS;
        case filter_clause_1.TimeFilterPeriod.CURRENT:
            return exports.CURRENT_PRESETS;
    }
}
exports.getTimeFilterPresets = getTimeFilterPresets;
//# sourceMappingURL=presets.js.map