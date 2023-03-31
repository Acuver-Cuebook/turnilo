"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const plywood_1 = require("plywood");
const presets_1 = require("../../../client/components/filter-menu/time-filter-menu/presets");
const limit_1 = require("../../limit/limit");
const general_1 = require("../../utils/general/general");
const time_shift_1 = require("../time-shift/time-shift");
const DEFAULT_TIME_SHIFTS = presets_1.DEFAULT_TIME_SHIFT_DURATIONS.map(time_shift_1.TimeShift.fromJS);
const DEFAULT_LATEST_PERIODS = presets_1.DEFAULT_LATEST_PERIOD_DURATIONS.map(chronoshift_1.Duration.fromJS);
function readKind(kind) {
    if (kind === "string" || kind === "boolean" || kind === "time" || kind === "number")
        return kind;
    throw new Error(`Unrecognized kind: ${kind}`);
}
function typeToKind(type) {
    if (!type)
        return "string";
    return readKind(type.toLowerCase().replace(/_/g, "-").replace(/-range$/, ""));
}
var BucketingStrategy;
(function (BucketingStrategy) {
    BucketingStrategy["defaultBucket"] = "defaultBucket";
    BucketingStrategy["defaultNoBucket"] = "defaultNoBucket";
})(BucketingStrategy = exports.BucketingStrategy || (exports.BucketingStrategy = {}));
exports.bucketingStrategies = {
    defaultBucket: BucketingStrategy.defaultBucket,
    defaultNoBucket: BucketingStrategy.defaultNoBucket
};
function readExpression(config) {
    if (config.formula)
        return plywood_1.Expression.parse(config.formula);
    if (config.expression)
        return plywood_1.Expression.parse(config.expression);
    return plywood_1.$(config.name);
}
function fromConfig(config) {
    const { kind: rawKind, description, name, title: rawTitle, url, sortStrategy } = config;
    general_1.verifyUrlSafeName(name);
    const kind = rawKind ? readKind(rawKind) : typeToKind(config.type);
    const expression = readExpression(config);
    const title = rawTitle || general_1.makeTitle(name);
    const limits = readLimits(config);
    switch (kind) {
        case "string": {
            const { multiValue } = config;
            return {
                description,
                url,
                name,
                title,
                expression,
                limits,
                multiValue: Boolean(multiValue),
                sortStrategy,
                kind
            };
        }
        case "boolean":
            return {
                description,
                url,
                name,
                title,
                expression,
                limits,
                sortStrategy,
                kind
            };
        case "time": {
            const { bucketedBy, bucketingStrategy } = config;
            return {
                kind,
                name,
                sortStrategy,
                title,
                url,
                description,
                expression,
                limits,
                bucketedBy: bucketedBy && chronoshift_1.Duration.fromJS(bucketedBy),
                bucketingStrategy: bucketingStrategy && exports.bucketingStrategies[bucketingStrategy],
                granularities: readGranularities(config, "time"),
                latestPeriodDurations: readLatestPeriodDurations(config),
                timeShiftDurations: readTimeShiftDurations(config)
            };
        }
        case "number": {
            const { bucketedBy, bucketingStrategy } = config;
            return {
                kind,
                name,
                sortStrategy,
                title,
                url,
                description,
                expression,
                limits,
                bucketedBy: bucketedBy && Number(bucketedBy),
                bucketingStrategy: bucketingStrategy && exports.bucketingStrategies[bucketingStrategy],
                granularities: readGranularities(config, "number")
            };
        }
    }
}
exports.fromConfig = fromConfig;
function readLimits({ name, limits }) {
    if (!limits)
        return limit_1.DEFAULT_LIMITS;
    if (!Array.isArray(limits)) {
        throw new Error(`must have list of valid limits in dimension '${name}'`);
    }
    return limits;
}
function readLatestPeriodDurations({ name, latestPeriodDurations }) {
    if (!latestPeriodDurations)
        return DEFAULT_LATEST_PERIODS;
    if (!Array.isArray(latestPeriodDurations) || latestPeriodDurations.length !== 5) {
        throw new Error(`must have list of 5 latestPeriodDurations in dimension '${name}'`);
    }
    return latestPeriodDurations.map(chronoshift_1.Duration.fromJS);
}
function readTimeShiftDurations({ name, timeShiftDurations }) {
    if (!timeShiftDurations)
        return DEFAULT_TIME_SHIFTS;
    if (!Array.isArray(timeShiftDurations) || timeShiftDurations.length !== 4) {
        throw new Error(`must have list of 4 timeShiftDurations in dimension '${name}'`);
    }
    return timeShiftDurations.map(time_shift_1.TimeShift.fromJS);
}
function readGranularities(config, kind) {
    const { granularities } = config;
    if (!granularities)
        return undefined;
    if (!Array.isArray(granularities) || granularities.length !== 5) {
        throw new Error(`must have list of 5 granularities in dimension '${config.name}'`);
    }
    switch (kind) {
        case "number":
            return granularities.map(g => Number(g));
        case "time":
            return granularities.map(g => chronoshift_1.Duration.fromJS(g));
    }
}
function serialize(dimension) {
    const { name, description, expression, title, sortStrategy, url, limits } = dimension;
    switch (dimension.kind) {
        case "string": {
            const { multiValue } = dimension;
            return {
                description,
                url,
                name,
                title,
                expression: expression.toJS(),
                limits,
                multiValue,
                sortStrategy,
                kind: dimension.kind
            };
        }
        case "boolean":
            return {
                description,
                url,
                name,
                title,
                expression: expression.toJS(),
                limits,
                sortStrategy,
                kind: dimension.kind
            };
        case "time": {
            const { granularities, bucketedBy, bucketingStrategy, latestPeriodDurations, timeShiftDurations } = dimension;
            return {
                description,
                url,
                name,
                title,
                expression: expression.toJS(),
                limits,
                sortStrategy,
                bucketingStrategy,
                bucketedBy: bucketedBy && bucketedBy.toJS(),
                granularities: granularities && granularities.map(g => g.toJS()),
                latestPeriodDurations: latestPeriodDurations.map(p => p.toJS()),
                timeShiftDurations: timeShiftDurations.map(ts => ts.toJS()),
                kind: dimension.kind
            };
        }
        case "number": {
            const { granularities, bucketedBy, bucketingStrategy } = dimension;
            return {
                description,
                url,
                name,
                title,
                expression: expression.toJS(),
                limits,
                sortStrategy,
                bucketingStrategy,
                bucketedBy,
                granularities,
                kind: dimension.kind
            };
        }
    }
}
exports.serialize = serialize;
function canBucketByDefault(dimension) {
    return isContinuous(dimension) && dimension.bucketingStrategy !== BucketingStrategy.defaultNoBucket;
}
exports.canBucketByDefault = canBucketByDefault;
function isContinuous(dimension) {
    const { kind } = dimension;
    return kind === "time" || kind === "number";
}
exports.isContinuous = isContinuous;
function createDimension(kind, name, expression, multiValue) {
    switch (kind) {
        case "string":
            return {
                kind,
                name,
                title: general_1.makeTitle(name),
                expression,
                limits: limit_1.DEFAULT_LIMITS,
                multiValue: Boolean(multiValue)
            };
        case "boolean":
            return {
                kind,
                name,
                title: general_1.makeTitle(name),
                limits: limit_1.DEFAULT_LIMITS,
                expression
            };
        case "time":
            return {
                latestPeriodDurations: DEFAULT_LATEST_PERIODS,
                timeShiftDurations: DEFAULT_TIME_SHIFTS,
                kind,
                name,
                limits: limit_1.DEFAULT_LIMITS,
                title: general_1.makeTitle(name),
                expression
            };
        case "number":
            return {
                kind,
                name,
                limits: limit_1.DEFAULT_LIMITS,
                title: general_1.makeTitle(name),
                expression
            };
    }
}
exports.createDimension = createDimension;
function timeDimension(timeAttribute) {
    return createDimension("time", "time", timeAttribute);
}
exports.timeDimension = timeDimension;
//# sourceMappingURL=dimension.js.map