"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../../common/models/dimension/dimensions");
const concrete_series_1 = require("../../../common/models/series/concrete-series");
const time_1 = require("../../../common/utils/time/time");
function findSeriesAndDerivation(name, concreteSeriesList) {
    for (const derivation of [concrete_series_1.SeriesDerivation.CURRENT, concrete_series_1.SeriesDerivation.PREVIOUS, concrete_series_1.SeriesDerivation.DELTA]) {
        const series = concreteSeriesList.find(s => s.plywoodKey(derivation) === name);
        if (series) {
            return { series, derivation };
        }
    }
    return null;
}
function tabularOptions(essence) {
    return {
        formatter: {
            TIME_RANGE: (range, timezone) => time_1.formatISODateTime(range.start, timezone)
        },
        attributeFilter: ({ name }) => {
            return findSeriesAndDerivation(name, essence.getConcreteSeries()) !== null
                || dimensions_1.findDimensionByName(essence.dataCube.dimensions, name) !== null;
        },
        attributeTitle: ({ name }) => {
            const seriesWithDerivation = findSeriesAndDerivation(name, essence.getConcreteSeries());
            if (seriesWithDerivation) {
                const { series, derivation } = seriesWithDerivation;
                return series.title(derivation);
            }
            const dimension = dimensions_1.findDimensionByName(essence.dataCube.dimensions, name);
            if (dimension) {
                return dimension.title;
            }
            return name;
        },
        timezone: essence.timezone
    };
}
exports.default = tabularOptions;
//# sourceMappingURL=tabular-options.js.map