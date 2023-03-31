"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const data_cube_1 = require("../../models/data-cube/data-cube");
const measures_1 = require("../../models/measure/measures");
const series_list_1 = require("../../models/series-list/series-list");
const measure_series_1 = require("../../models/series/measure-series");
const split_1 = require("../../models/split/split");
const splits_1 = require("../../models/splits/splits");
class Resolutions {
}
exports.Resolutions = Resolutions;
Resolutions.someDimensions = (dataCube) => {
    const numberOfSuggestedSplitDimensions = 2;
    const suggestedSplitDimensions = data_cube_1.getDimensionsByKind(dataCube, "string")
        .slice(0, numberOfSuggestedSplitDimensions);
    return suggestedSplitDimensions.map(dimension => {
        return {
            description: `Add a split on ${dimension.title}`,
            adjustment: {
                splits: splits_1.Splits.fromSplit(split_1.Split.fromDimension(dimension))
            }
        };
    });
};
Resolutions.defaultSelectedMeasures = (dataCube) => {
    const defaultSelectedMeasures = dataCube.defaultSelectedMeasures || [];
    const measures = defaultSelectedMeasures.map(measureName => measures_1.findMeasureByName(dataCube.measures, measureName));
    if (measures.length === 0) {
        return [];
    }
    const measureTitles = measures.map(measure => measure.title);
    return [
        {
            description: `Select default measures: ${measureTitles.join(", ")}`,
            adjustment: {
                series: new series_list_1.SeriesList({ series: immutable_1.List(measures.map(measure => measure_series_1.MeasureSeries.fromMeasure(measure))) })
            }
        }
    ];
};
Resolutions.firstMeasure = (dataCube) => {
    const firstMeasure = measures_1.allMeasures(dataCube.measures)[0];
    if (!firstMeasure)
        return [];
    return [
        {
            description: `Select measure: ${firstMeasure.title}`,
            adjustment: {
                series: new series_list_1.SeriesList({ series: immutable_1.List.of(measure_series_1.MeasureSeries.fromMeasure(firstMeasure)) })
            }
        }
    ];
};
//# sourceMappingURL=resolutions.js.map