"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../models/dimension/dimensions");
const measures_1 = require("../../models/measure/measures");
const measure_series_1 = require("../../models/series/measure-series");
const split_1 = require("../../models/split/split");
const visualization_manifest_1 = require("../../models/visualization-manifest/visualization-manifest");
const predicates_1 = require("../../utils/rules/predicates");
const visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
const settings_1 = require("./settings");
const rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.numberOfSplitsIsNot(1))
    .then(variables => visualization_manifest_1.Resolve.manual(3, "Scatterplot needs exactly 1 split", variables.splits.length() > 1 ? suggestRemovingSplits(variables) : suggestAddingSplits(variables)))
    .when(predicates_1.Predicates.numberOfSeriesIsNot(2))
    .then(variables => visualization_manifest_1.Resolve.manual(3, "Scatterplot needs exactly 2 measures", variables.series.series.size < 2 ? suggestAddingMeasure(variables) : suggestRemovingMeasures(variables)))
    .otherwise(({ isSelectedVisualization }) => visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 3))
    .build();
const suggestRemovingSplits = ({ splits }) => [{
        description: splits.length() === 2 ? "Remove last split" : `Remove last ${splits.length() - 1} splits`,
        adjustment: { splits: splits.slice(0, 1) }
    }];
const suggestAddingSplits = ({ dataCube, splits }) => dimensions_1.allDimensions(dataCube.dimensions)
    .filter(dimension => !splits.hasSplitOn(dimension))
    .slice(0, 2)
    .map(dimension => ({
    description: `Add ${dimension.title} split`,
    adjustment: {
        splits: splits.addSplit(split_1.Split.fromDimension(dimension))
    }
}));
const suggestAddingMeasure = ({ dataCube, series }) => {
    const firstSeriesKey = series.getSeriesKeys().first();
    const notUsedMeasures = measures_1.allMeasures(dataCube.measures).filter(measure => measure.name !== firstSeriesKey);
    if (notUsedMeasures.length > 0) {
        const firstMeasure = notUsedMeasures[0];
        return [{
                description: `Add measure ${firstMeasure.title}`,
                adjustment: {
                    series: series.addSeries(measure_series_1.MeasureSeries.fromMeasure(firstMeasure))
                }
            }];
    }
    return [{
            description: "Second measure needed",
            adjustment: null
        }];
};
const suggestRemovingMeasures = ({ series }) => [{
        description: series.count() === 3 ? "Remove last measure" : "Use first two measures",
        adjustment: {
            series: series.takeNFirst(2)
        }
    }];
exports.SCATTERPLOT_MANIFEST = new visualization_manifest_1.VisualizationManifest("scatterplot", "Scatterplot", rulesEvaluator, settings_1.settings);
//# sourceMappingURL=scatterplot.js.map