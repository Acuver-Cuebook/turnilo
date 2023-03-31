"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
function timeFilterCanonicalLength(essence, timekeeper) {
    const currentTimeFilter = essence.currentTimeFilter(timekeeper);
    const { start, end } = currentTimeFilter.values.get(0);
    const currentTimeRange = new chronoshift_1.Duration(start, end, essence.timezone);
    return currentTimeRange.getCanonicalLength();
}
exports.default = timeFilterCanonicalLength;
//# sourceMappingURL=time-filter-canonical-length.js.map