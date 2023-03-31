"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../models/dimension/dimensions");
const visualization_manifest_1 = require("../../models/visualization-manifest/visualization-manifest");
const empty_settings_config_1 = require("../../models/visualization-settings/empty-settings-config");
const functional_1 = require("../../utils/functional/functional");
const actions_1 = require("../../utils/rules/actions");
const predicates_1 = require("../../utils/rules/predicates");
const split_adjustments_1 = require("../../utils/rules/split-adjustments");
const visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
exports.GRID_LIMITS = [50, 100, 200, 500, 1000, 10000];
const rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.noSplits())
    .then(actions_1.Actions.manualDimensionSelection("The Grid requires at least one split"))
    .when(predicates_1.Predicates.noSelectedMeasures())
    .then(actions_1.Actions.manualMeasuresSelection())
    .otherwise(({ isSelectedVisualization, series, dataCube, splits }) => {
    const firstSplit = splits.getSplit(0);
    const splitReferences = splits.splits.toArray().map(split => split.reference);
    const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, firstSplit.reference);
    const fixedFirstSplit = functional_1.thread(firstSplit, split_adjustments_1.adjustFiniteLimit(exports.GRID_LIMITS), split_adjustments_1.adjustSort(dimension, series, splitReferences));
    const newSplits = splits.replace(firstSplit, fixedFirstSplit);
    if (splits.equals(newSplits)) {
        return visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 6);
    }
    return visualization_manifest_1.Resolve.automatic(6, { splits: newSplits });
})
    .build();
exports.GRID_MANIFEST = new visualization_manifest_1.VisualizationManifest("grid", "Grid", rulesEvaluator, empty_settings_config_1.emptySettingsConfig);
//# sourceMappingURL=grid.js.map