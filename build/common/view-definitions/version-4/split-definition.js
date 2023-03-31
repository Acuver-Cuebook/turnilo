"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const dimensions_1 = require("../../models/dimension/dimensions");
const concrete_series_1 = require("../../models/series/concrete-series");
const sort_1 = require("../../models/sort/sort");
const split_1 = require("../../models/split/split");
const general_1 = require("../../utils/general/general");
const PREVIOUS_PREFIX = "_previous__";
const DELTA_PREFIX = "_delta__";
function inferType(type, reference, dimensionName) {
    switch (type) {
        case sort_1.SortType.DIMENSION:
            return sort_1.SortType.DIMENSION;
        case sort_1.SortType.SERIES:
            return sort_1.SortType.SERIES;
        default:
            return reference === dimensionName ? sort_1.SortType.DIMENSION : sort_1.SortType.SERIES;
    }
}
function inferPeriodAndReference({ ref, period }) {
    if (period)
        return { period, reference: ref };
    if (ref.indexOf(PREVIOUS_PREFIX) === 0)
        return { reference: ref.substring(PREVIOUS_PREFIX.length), period: concrete_series_1.SeriesDerivation.PREVIOUS };
    if (ref.indexOf(DELTA_PREFIX) === 0)
        return { reference: ref.substring(DELTA_PREFIX.length), period: concrete_series_1.SeriesDerivation.DELTA };
    return { reference: ref, period: concrete_series_1.SeriesDerivation.CURRENT };
}
function toSort(sort, dimensionName) {
    const { direction } = sort;
    const { reference, period } = inferPeriodAndReference(sort);
    const type = inferType(sort.type, reference, dimensionName);
    switch (type) {
        case sort_1.SortType.DIMENSION:
            return new sort_1.DimensionSort({ reference, direction });
        case sort_1.SortType.SERIES:
            return new sort_1.SeriesSort({ reference, direction, period });
    }
}
function fromSort(sort) {
    const { reference: ref, ...rest } = sort.toJS();
    return { ref, ...rest };
}
function firstLimitValue(dimension) {
    return dimension.limits[0];
}
function toLimit(limit, dimension) {
    if (limit === null)
        return null;
    if (general_1.isNumber(limit) && general_1.isFiniteNumber(limit))
        return limit;
    return firstLimitValue(dimension);
}
const numberSplitConversion = {
    toSplitCombine(split, dimension) {
        const { limit, sort, granularity } = split;
        return new split_1.Split({
            type: split_1.SplitType.number,
            reference: dimension.name,
            bucket: granularity,
            sort: sort && toSort(sort, dimension.name),
            limit: toLimit(limit, dimension)
        });
    },
    fromSplitCombine({ bucket, sort, reference, limit }) {
        if (typeof bucket === "number") {
            return {
                type: split_1.SplitType.number,
                dimension: reference,
                granularity: bucket,
                sort: sort && fromSort(sort),
                limit
            };
        }
        else {
            throw new Error("");
        }
    }
};
const timeSplitConversion = {
    toSplitCombine(split, dimension) {
        const { limit, sort, granularity } = split;
        return new split_1.Split({
            type: split_1.SplitType.time,
            reference: dimension.name,
            bucket: chronoshift_1.Duration.fromJS(granularity),
            sort: sort && toSort(sort, dimension.name),
            limit: toLimit(limit, dimension)
        });
    },
    fromSplitCombine({ limit, sort, reference, bucket }) {
        if (bucket instanceof chronoshift_1.Duration) {
            return {
                type: split_1.SplitType.time,
                dimension: reference,
                granularity: bucket.toJS(),
                sort: sort && fromSort(sort),
                limit
            };
        }
        else {
            throw new Error("");
        }
    }
};
const stringSplitConversion = {
    toSplitCombine(split, dimension) {
        const { limit, sort } = split;
        return new split_1.Split({
            reference: dimension.name,
            sort: sort && toSort(sort, dimension.name),
            limit: toLimit(limit, dimension)
        });
    },
    fromSplitCombine({ limit, sort, reference }) {
        return {
            type: split_1.SplitType.string,
            dimension: reference,
            sort: sort && fromSort(sort),
            limit
        };
    }
};
const booleanSplitConversion = {
    fromSplitCombine({ limit, sort, reference }) {
        return {
            type: split_1.SplitType.boolean,
            dimension: reference,
            sort: sort && fromSort(sort),
            limit
        };
    },
    toSplitCombine(split, dimension) {
        const { limit, sort } = split;
        return new split_1.Split({
            type: split_1.SplitType.boolean,
            reference: dimension.name,
            sort: sort && toSort(sort, dimension.name),
            limit: toLimit(limit, dimension)
        });
    }
};
const splitConversions = {
    boolean: booleanSplitConversion,
    number: numberSplitConversion,
    string: stringSplitConversion,
    time: timeSplitConversion
};
exports.splitConverter = {
    toSplitCombine(split, dataCube) {
        const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.dimension);
        if (dimension == null) {
            throw new Error(`Dimension ${split.dimension} not found in data cube ${dataCube.name}.`);
        }
        return splitConversions[split_1.kindToType(dimension.kind)].toSplitCombine(split, dimension);
    },
    fromSplitCombine(splitCombine) {
        switch (splitCombine.type) {
            case split_1.SplitType.boolean:
                return booleanSplitConversion.fromSplitCombine(splitCombine);
            case split_1.SplitType.number:
                return numberSplitConversion.fromSplitCombine(splitCombine);
            case split_1.SplitType.string:
                return stringSplitConversion.fromSplitCombine(splitCombine);
            case split_1.SplitType.time:
                return timeSplitConversion.fromSplitCombine(splitCombine);
        }
    }
};
//# sourceMappingURL=split-definition.js.map