"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const plywood_1 = require("plywood");
const dimension_1 = require("../../common/models/dimension/dimension");
const time_shift_1 = require("../../common/models/time-shift/time-shift");
function deserialize(dimension) {
    const { description, url, name, title, expression, limits, sortStrategy } = dimension;
    switch (dimension.kind) {
        case "string": {
            return {
                kind: dimension.kind,
                description,
                url,
                name,
                title,
                limits,
                sortStrategy,
                expression: plywood_1.Expression.fromJS(expression),
                multiValue: dimension.multiValue
            };
        }
        case "boolean":
            return {
                kind: dimension.kind,
                description,
                url,
                name,
                title,
                limits,
                sortStrategy,
                expression: plywood_1.Expression.fromJS(expression)
            };
        case "number": {
            const { bucketedBy, bucketingStrategy, granularities } = dimension;
            return {
                kind: dimension.kind,
                description,
                url,
                name,
                title,
                limits,
                sortStrategy,
                expression: plywood_1.Expression.fromJS(expression),
                granularities,
                bucketedBy,
                bucketingStrategy: bucketingStrategy && dimension_1.bucketingStrategies[bucketingStrategy]
            };
        }
        case "time": {
            const { bucketedBy, bucketingStrategy, granularities, timeShiftDurations, latestPeriodDurations } = dimension;
            return {
                kind: dimension.kind,
                description,
                url,
                name,
                title,
                limits,
                sortStrategy,
                expression: plywood_1.Expression.fromJS(expression),
                bucketedBy: bucketedBy && chronoshift_1.Duration.fromJS(bucketedBy),
                bucketingStrategy: bucketingStrategy && dimension_1.bucketingStrategies[bucketingStrategy],
                granularities: granularities && granularities.map(chronoshift_1.Duration.fromJS),
                timeShiftDurations: timeShiftDurations.map(time_shift_1.TimeShift.fromJS),
                latestPeriodDurations: latestPeriodDurations.map(chronoshift_1.Duration.fromJS)
            };
        }
    }
}
exports.deserialize = deserialize;
//# sourceMappingURL=dimension.js.map