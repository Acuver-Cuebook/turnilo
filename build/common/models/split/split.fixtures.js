"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const concrete_series_1 = require("../series/concrete-series");
const sort_1 = require("../sort/sort");
const split_1 = require("./split");
const createSort = (isDimension, { reference, direction, period } = { direction: sort_1.SortDirection.ascending, period: concrete_series_1.SeriesDerivation.CURRENT }) => {
    if (isDimension)
        return new sort_1.DimensionSort({ reference, direction });
    return new sort_1.SeriesSort({ reference, direction, period });
};
function stringSplitCombine(dimension, { limit = 50, sort: { direction = sort_1.SortDirection.ascending, period = concrete_series_1.SeriesDerivation.CURRENT, reference = dimension } = {} } = {}) {
    return new split_1.Split({
        reference: dimension,
        sort: createSort(dimension === reference, { reference, period, direction }),
        limit
    });
}
exports.stringSplitCombine = stringSplitCombine;
function booleanSplitCombine(dimension, { limit = 50, sort: { direction = sort_1.SortDirection.ascending, period = concrete_series_1.SeriesDerivation.CURRENT, reference = dimension } = {} } = {}) {
    return new split_1.Split({
        type: split_1.SplitType.boolean,
        reference: dimension,
        sort: createSort(dimension === reference, { reference, period, direction }),
        limit
    });
}
exports.booleanSplitCombine = booleanSplitCombine;
function numberSplitCombine(dimension, granularity = 100, { limit = 50, sort: { direction = sort_1.SortDirection.ascending, period = concrete_series_1.SeriesDerivation.CURRENT, reference = dimension } = {} } = {}) {
    return new split_1.Split({
        type: split_1.SplitType.number,
        reference: dimension,
        bucket: granularity,
        sort: createSort(dimension === reference, { direction, period, reference }),
        limit
    });
}
exports.numberSplitCombine = numberSplitCombine;
function timeSplitCombine(dimension, granularity = "PT1H", { limit = 50, sort: { direction = sort_1.SortDirection.ascending, period = concrete_series_1.SeriesDerivation.CURRENT, reference = dimension } = {} } = {}) {
    return new split_1.Split({
        type: split_1.SplitType.time,
        reference: dimension,
        bucket: chronoshift_1.Duration.fromJS(granularity),
        sort: createSort(dimension === reference, { direction, period, reference }),
        limit
    });
}
exports.timeSplitCombine = timeSplitCombine;
//# sourceMappingURL=split.fixtures.js.map