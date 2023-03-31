"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const concrete_series_1 = require("../series/concrete-series");
const measure_series_1 = require("../series/measure-series");
var SortType;
(function (SortType) {
    SortType["SERIES"] = "series";
    SortType["DIMENSION"] = "dimension";
})(SortType = exports.SortType || (exports.SortType = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ascending"] = "ascending";
    SortDirection["descending"] = "descending";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
exports.sortDirectionMapper = {
    ascending: "ascending",
    descending: "descending"
};
const defaultSeriesSort = {
    reference: null,
    type: SortType.SERIES,
    direction: SortDirection.descending,
    period: concrete_series_1.SeriesDerivation.CURRENT
};
class SeriesSort extends immutable_1.Record(defaultSeriesSort) {
    constructor(params) {
        super(params);
    }
    toExpression() {
        const series = new measure_series_1.MeasureSeries({ reference: this.reference });
        return new plywood_1.SortExpression({
            direction: exports.sortDirectionMapper[this.direction],
            expression: plywood_1.$(series.plywoodKey(this.period))
        });
    }
}
exports.SeriesSort = SeriesSort;
const defaultDimensionSort = {
    reference: null,
    type: SortType.DIMENSION,
    direction: SortDirection.descending
};
class DimensionSort extends immutable_1.Record(defaultDimensionSort) {
    constructor(params) {
        super(params);
    }
    toExpression() {
        return new plywood_1.SortExpression(({
            direction: exports.sortDirectionMapper[this.direction],
            expression: plywood_1.$(this.reference)
        }));
    }
}
exports.DimensionSort = DimensionSort;
function isSortEmpty(sort) {
    return sort.reference === null;
}
exports.isSortEmpty = isSortEmpty;
//# sourceMappingURL=sort.js.map