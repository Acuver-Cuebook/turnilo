"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const filter_clause_1 = require("../filter-clause/filter-clause");
function isValidTimeShift(input) {
    try {
        TimeShift.fromJS(input);
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.isValidTimeShift = isValidTimeShift;
class TimeShift {
    constructor(value) {
        this.value = value;
    }
    static fromJS(timeShift) {
        if (timeShift === null) {
            return TimeShift.empty();
        }
        return new TimeShift(chronoshift_1.Duration.fromJS(timeShift));
    }
    static empty() {
        return new TimeShift(null);
    }
    static isTimeShift(candidate) {
        return candidate instanceof TimeShift;
    }
    equals(other) {
        if (!TimeShift.isTimeShift(other)) {
            return false;
        }
        if (this.value === null) {
            return other.value === null;
        }
        return this.value.equals(other.value);
    }
    toJS() {
        return this.value === null ? null : this.value.toJS();
    }
    toJSON() {
        return this.toJS();
    }
    valueOf() {
        return this.value;
    }
    isEmpty() {
        return this.value === null;
    }
    getDescription(capitalize = false) {
        return this.value.getDescription(capitalize);
    }
    toString() {
        return this.toJS() || "";
    }
    isValidForTimeFilter(timeFilter, timezone) {
        switch (timeFilter.type) {
            case filter_clause_1.FilterTypes.FIXED_TIME:
                const { values } = timeFilter;
                const range = values.first();
                return !range.intersects(range.shift(this.value, timezone));
            case filter_clause_1.FilterTypes.RELATIVE_TIME:
                const { duration } = timeFilter;
                return this.value.getCanonicalLength() >= duration.getCanonicalLength();
            default:
                throw new Error(`Unknown time filter: ${timeFilter}`);
        }
    }
    constrainToFilter(timeFilter, timezone) {
        return this.value && this.isValidForTimeFilter(timeFilter, timezone) ? this : TimeShift.empty();
    }
}
exports.TimeShift = TimeShift;
//# sourceMappingURL=time-shift.js.map