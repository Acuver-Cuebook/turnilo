"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const formatter_1 = require("../../utils/formatter/formatter");
const general_1 = require("../../utils/general/general");
const nullable_equals_1 = __importDefault(require("../../utils/immutable-utils/nullable-equals"));
const sort_1 = require("../sort/sort");
const time_shift_env_1 = require("../time-shift/time-shift-env");
var SplitType;
(function (SplitType) {
    SplitType["number"] = "number";
    SplitType["string"] = "string";
    SplitType["time"] = "time";
    SplitType["boolean"] = "boolean";
})(SplitType = exports.SplitType || (exports.SplitType = {}));
function isContinuousSplit({ type }) {
    return type === SplitType.time || type === SplitType.number;
}
exports.isContinuousSplit = isContinuousSplit;
const defaultSplit = {
    type: SplitType.string,
    reference: null,
    bucket: null,
    sort: new sort_1.DimensionSort({ reference: null }),
    limit: null
};
function bucketToAction(bucket) {
    return bucket instanceof chronoshift_1.Duration
        ? new plywood_1.TimeBucketExpression({ duration: bucket })
        : new plywood_1.NumberBucketExpression({ size: bucket });
}
exports.bucketToAction = bucketToAction;
function applyTimeShift(type, expression, env) {
    if (env.type === time_shift_env_1.TimeShiftEnvType.WITH_PREVIOUS && type === SplitType.time) {
        return env.currentFilter.then(expression).fallback(expression.timeShift(env.shift));
    }
    return expression;
}
function toExpression({ bucket, type }, { expression }, env) {
    const expWithShift = applyTimeShift(type, expression, env);
    if (!bucket)
        return expWithShift;
    return expWithShift.performAction(bucketToAction(bucket));
}
exports.toExpression = toExpression;
function kindToType(kind) {
    switch (kind) {
        case "time":
            return SplitType.time;
        case "number":
            return SplitType.number;
        case "boolean":
            return SplitType.boolean;
        case "string":
            return SplitType.string;
    }
}
exports.kindToType = kindToType;
class Split extends immutable_1.Record(defaultSplit) {
    static fromDimension({ name, kind, limits }) {
        return new Split({ reference: name, type: kindToType(kind), limit: limits[limits.length - 1] });
    }
    toString() {
        return `[SplitCombine: ${this.reference}]`;
    }
    toKey() {
        return this.reference;
    }
    changeBucket(bucket) {
        return this.set("bucket", bucket);
    }
    changeSort(sort) {
        return this.set("sort", sort);
    }
    changeLimit(limit) {
        return this.set("limit", limit);
    }
    getTitle(dimension) {
        return (dimension ? dimension.title : "?") + this.getBucketTitle();
    }
    selectValue(datum) {
        return datum[this.toKey()];
    }
    formatValue(datum, timezone) {
        return formatter_1.formatValue(datum[this.toKey()], timezone);
    }
    getBucketTitle() {
        const { bucket } = this;
        if (!general_1.isTruthy(bucket)) {
            return "";
        }
        if (bucket instanceof chronoshift_1.Duration) {
            return ` (${bucket.getDescription(true)})`;
        }
        return ` (by ${bucket})`;
    }
    equals(other) {
        if (this.type !== SplitType.time)
            return super.equals(other);
        return other instanceof Split &&
            this.type === other.type &&
            this.reference === other.reference &&
            this.sort.equals(other.sort) &&
            this.limit === other.limit &&
            nullable_equals_1.default(this.bucket, other.bucket);
    }
}
exports.Split = Split;
//# sourceMappingURL=split.js.map