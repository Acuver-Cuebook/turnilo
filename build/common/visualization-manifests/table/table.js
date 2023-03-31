"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../models/dimension/dimensions");
const visualization_manifest_1 = require("../../models/visualization-manifest/visualization-manifest");
const functional_1 = require("../../utils/functional/functional");
const actions_1 = require("../../utils/rules/actions");
const predicates_1 = require("../../utils/rules/predicates");
const split_adjustments_1 = require("../../utils/rules/split-adjustments");
const visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
const settings_1 = require("./settings");
const rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.noSplits())
    .then(actions_1.Actions.manualDimensionSelection("The Table requires at least one split"))
    .when(predicates_1.Predicates.supportedSplitsCount())
    .then(actions_1.Actions.removeExcessiveSplits("Table"))
    .otherwise(({ splits, dataCube, series, isSelectedVisualization }) => {
    const newSplits = splits.update("splits", splits => splits.map(split => {
        const splitDimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.reference);
        return functional_1.threadConditionally(split, split_adjustments_1.adjustLimit(splitDimension), split_adjustments_1.adjustSort(splitDimension, series));
    }));
    const changed = !newSplits.equals(splits);
    return changed
        ? visualization_manifest_1.Resolve.automatic(6, { splits: newSplits })
        : visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 6);
})
    .build();
exports.TABLE_MANIFEST = new visualization_manifest_1.VisualizationManifest("table", "Table", rulesEvaluator, settings_1.settings);
//# sourceMappingURL=table.js.map