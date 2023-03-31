"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../models/dimension/dimensions");
const measures_1 = require("../../models/measure/measures");
const measure_series_1 = require("../../models/series/measure-series");
const split_1 = require("../../models/split/split");
const visualization_manifest_1 = require("../../models/visualization-manifest/visualization-manifest");
const empty_settings_config_1 = require("../../models/visualization-settings/empty-settings-config");
const functional_1 = require("../../utils/functional/functional");
const predicates_1 = require("../../utils/rules/predicates");
const split_adjustments_1 = require("../../utils/rules/split-adjustments");
const visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
const rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.numberOfSplitsIsNot(2))
    .then(variables => visualization_manifest_1.Resolve.manual(3, "Heatmap needs exactly 2 splits", variables.splits.length() > 2 ? suggestRemovingSplits(variables) : suggestAddingSplits(variables)))
    .when(predicates_1.Predicates.numberOfSeriesIsNot(1))
    .then(variables => visualization_manifest_1.Resolve.manual(3, "Heatmap needs exactly 1 measure", variables.series.series.size === 0 ? suggestAddingMeasure(variables) : suggestRemovingMeasures(variables)))
    .otherwise(({ splits, dataCube, series }) => {
    const newSplits = splits.update("splits", splits => splits.map(split => {
        const splitDimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.reference);
        return functional_1.thread(split, split_adjustments_1.adjustLimit(splitDimension), split_adjustments_1.adjustSort(splitDimension, series));
    }));
    const changed = !newSplits.equals(splits);
    return changed
        ? visualization_manifest_1.Resolve.automatic(10, { splits: newSplits })
        : visualization_manifest_1.Resolve.ready(10);
})
    .build();
const suggestRemovingSplits = ({ splits }) => [{
        description: splits.length() === 3 ? "Remove last split" : `Remove last ${splits.length() - 2} splits`,
        adjustment: { splits: splits.slice(0, 2) }
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
    const firstMeasure = measures_1.allMeasures(dataCube.measures)[0];
    return [{
            description: `Add measure ${firstMeasure.title}`,
            adjustment: {
                series: series.addSeries(measure_series_1.MeasureSeries.fromMeasure(firstMeasure))
            }
        }];
};
const suggestRemovingMeasures = ({ series }) => [{
        description: series.count() === 2 ? "Remove last measure" : `Remove last ${series.count() - 1} measures`,
        adjustment: {
            series: series.takeFirst()
        }
    }];
exports.HEAT_MAP_MANIFEST = new visualization_manifest_1.VisualizationManifest("heatmap", "Heatmap", rulesEvaluator, empty_settings_config_1.emptySettingsConfig);
//# sourceMappingURL=heat-map.js.map