"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const defaultDateRange = { start: null, end: null };
const plywoodRange = ({ start, end }) => plywood_1.Range.fromJS({ start, end, bounds: "()" });
class DateRange extends immutable_1.Record(defaultDateRange) {
    intersects(other) {
        return other instanceof DateRange && plywoodRange(this).intersects(plywoodRange(other));
    }
    shift(duration, timezone) {
        return this
            .set("start", duration.shift(this.start, timezone, -1))
            .set("end", duration.shift(this.end, timezone, -1));
    }
}
exports.DateRange = DateRange;
//# sourceMappingURL=date-range.js.map