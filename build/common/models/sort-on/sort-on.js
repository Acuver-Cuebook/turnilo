"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../dimension/dimensions");
const concrete_series_1 = require("../series/concrete-series");
const sort_1 = require("../sort/sort");
class SortOn {
    constructor(key, title, period) {
        this.key = key;
        this.title = title;
        this.period = period;
    }
    static fromSort(sort, essence) {
        const { type, reference } = sort;
        switch (type) {
            case sort_1.SortType.DIMENSION:
                const dimension = dimensions_1.findDimensionByName(essence.dataCube.dimensions, reference);
                return new DimensionSortOn(dimension);
            case sort_1.SortType.SERIES:
                const period = sort.period;
                const series = essence.findConcreteSeries(reference);
                return new SeriesSortOn(series, period);
        }
    }
    static getKey(sortOn) {
        return sortOn.key;
    }
    static getTitle(sortOn) {
        return sortOn.title;
    }
    static equals(sortOn, other) {
        if (!sortOn)
            return sortOn === other;
        return sortOn.equals(other);
    }
}
exports.SortOn = SortOn;
class DimensionSortOn extends SortOn {
    constructor(dimension) {
        super(dimension.name, dimension.title);
    }
    equals(other) {
        return other instanceof DimensionSortOn
            && this.key === other.key
            && this.title === other.title;
    }
    toSort(direction) {
        return new sort_1.DimensionSort({ direction, reference: this.key });
    }
}
exports.DimensionSortOn = DimensionSortOn;
class SeriesSortOn extends SortOn {
    constructor(series, period = concrete_series_1.SeriesDerivation.CURRENT) {
        super(series.definition.key(), series.title(period), period);
    }
    equals(other) {
        return other instanceof SeriesSortOn
            && this.key === other.key
            && this.title === other.title
            && this.period === other.period;
    }
    toSort(direction) {
        return new sort_1.SeriesSort({ reference: this.key, direction, period: this.period });
    }
}
exports.SeriesSortOn = SeriesSortOn;
//# sourceMappingURL=sort-on.js.map