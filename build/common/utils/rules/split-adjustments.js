"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("../../models/colors/colors");
const sort_1 = require("../../models/sort/sort");
const split_1 = require("../../models/split/split");
const functional_1 = require("../functional/functional");
function adjustColorSplit(split, dimension, series, visualizationColors) {
    const colorsCount = visualizationColors.series.length;
    return functional_1.thread(split, adjustSort(dimension, series), adjustFiniteLimit(colors_1.colorSplitLimits(colorsCount), colorsCount));
}
exports.adjustColorSplit = adjustColorSplit;
function adjustContinuousSplit(split) {
    const { reference } = split;
    return split
        .changeLimit(null)
        .changeSort(new sort_1.DimensionSort({
        reference,
        direction: sort_1.SortDirection.ascending
    }));
}
exports.adjustContinuousSplit = adjustContinuousSplit;
function adjustLimit({ kind, limits }) {
    const isTimeSplit = kind === "time";
    const availableLimits = isTimeSplit ? [...limits, null] : limits;
    return adjustFiniteLimit(availableLimits);
}
exports.adjustLimit = adjustLimit;
function adjustFiniteLimit(availableLimits, defaultLimit = availableLimits[0]) {
    return (split) => {
        const { limit } = split;
        return availableLimits.indexOf(limit) === -1
            ? split.changeLimit(defaultLimit)
            : split;
    };
}
exports.adjustFiniteLimit = adjustFiniteLimit;
function adjustSort(dimension, series, availableDimensions = [dimension.name]) {
    return (split) => {
        const { sort } = split;
        if (sort instanceof sort_1.SeriesSort)
            return split;
        if (availableDimensions.indexOf(sort.reference) !== -1)
            return split;
        const direction = sort_1.SortDirection.descending;
        const { sortStrategy } = dimension;
        if (sortStrategy) {
            if (sortStrategy === "self" || split.reference === sortStrategy) {
                return split.changeSort(new sort_1.DimensionSort({
                    reference: split.reference,
                    direction
                }));
            }
            if (series.hasMeasureSeries(sortStrategy)) {
                return split.changeSort(new sort_1.SeriesSort({
                    reference: sortStrategy,
                    direction
                }));
            }
        }
        if (split.type === split_1.SplitType.string) {
            return split.changeSort(new sort_1.SeriesSort({
                reference: series.series.first().reference,
                direction: sort_1.SortDirection.descending
            }));
        }
        return split.changeSort(new sort_1.DimensionSort({
            reference: split.reference,
            direction
        }));
    };
}
exports.adjustSort = adjustSort;
//# sourceMappingURL=split-adjustments.js.map