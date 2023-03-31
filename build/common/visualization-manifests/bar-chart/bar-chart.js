"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const dimensions_1 = require("../../models/dimension/dimensions");
const split_1 = require("../../models/split/split");
const splits_1 = require("../../models/splits/splits");
const visualization_manifest_1 = require("../../models/visualization-manifest/visualization-manifest");
const empty_settings_config_1 = require("../../models/visualization-settings/empty-settings-config");
const functional_1 = require("../../utils/functional/functional");
const actions_1 = require("../../utils/rules/actions");
const predicates_1 = require("../../utils/rules/predicates");
const split_adjustments_1 = require("../../utils/rules/split-adjustments");
const visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
const rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.noSplits())
    .then(actions_1.Actions.manualDimensionSelection("The Bar Chart requires at least one split"))
    .when(predicates_1.Predicates.areExactSplitKinds("time"))
    .or(predicates_1.Predicates.areExactSplitKinds("number"))
    .then(({ splits, isSelectedVisualization }) => {
    const continuousSplit = splits.getSplit(0);
    const numberBoost = continuousSplit.type === split_1.SplitType.number ? 3 : 0;
    const newContinuousSplit = split_adjustments_1.adjustContinuousSplit(continuousSplit);
    if (continuousSplit.equals(newContinuousSplit))
        return visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 3);
    return visualization_manifest_1.Resolve.automatic(6 + numberBoost, {
        splits: new splits_1.Splits({
            splits: immutable_1.List([newContinuousSplit])
        })
    });
})
    .when(predicates_1.Predicates.areExactSplitKinds("time", "*"))
    .or(predicates_1.Predicates.areExactSplitKinds("number", "*"))
    .then(({ splits, series, dataCube, appSettings }) => {
    const continuousSplit = splits.getSplit(0);
    const numberBoost = continuousSplit.type === split_1.SplitType.number ? 3 : 0;
    const nominalSplit = splits.getSplit(1);
    const nominalDimension = dimensions_1.findDimensionByName(dataCube.dimensions, nominalSplit.reference);
    return visualization_manifest_1.Resolve.automatic(6 + numberBoost, {
        splits: new splits_1.Splits({
            splits: immutable_1.List([
                split_adjustments_1.adjustColorSplit(nominalSplit, nominalDimension, series, appSettings.customization.visualizationColors),
                split_adjustments_1.adjustContinuousSplit(continuousSplit)
            ])
        })
    });
})
    .when(predicates_1.Predicates.areExactSplitKinds("*", "time"))
    .or(predicates_1.Predicates.areExactSplitKinds("*", "number"))
    .then(({ splits, series, dataCube, isSelectedVisualization, appSettings }) => {
    const continuousSplit = splits.getSplit(1);
    const numberBoost = continuousSplit.type === split_1.SplitType.number ? 3 : 0;
    const nominalSplit = splits.getSplit(0);
    const nominalDimension = dimensions_1.findDimensionByName(dataCube.dimensions, nominalSplit.reference);
    const newSplits = new splits_1.Splits({
        splits: immutable_1.List([
            split_adjustments_1.adjustColorSplit(nominalSplit, nominalDimension, series, appSettings.customization.visualizationColors),
            split_adjustments_1.adjustContinuousSplit(continuousSplit)
        ])
    });
    const changed = !splits.equals(newSplits);
    if (!changed)
        return visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 3);
    return visualization_manifest_1.Resolve.automatic(6 + numberBoost, {
        splits: newSplits
    });
})
    .when(predicates_1.Predicates.areExactSplitKinds("*"))
    .or(predicates_1.Predicates.areExactSplitKinds("*", "*"))
    .then(({ splits, series, dataCube, isSelectedVisualization }) => {
    const newSplits = splits.update("splits", splits => splits.map((split) => {
        const splitDimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.reference);
        return functional_1.thread(split, split_adjustments_1.adjustFiniteLimit(splitDimension.limits), split_adjustments_1.adjustSort(splitDimension, series));
    }));
    const changed = !splits.equals(newSplits);
    if (changed) {
        return visualization_manifest_1.Resolve.automatic(5, { splits: newSplits });
    }
    return visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 6);
})
    .otherwise(({ dataCube }) => {
    const categoricalDimensions = dimensions_1.allDimensions(dataCube.dimensions).filter(dimension => dimension.kind !== "time");
    return visualization_manifest_1.Resolve.manual(visualization_manifest_1.NORMAL_PRIORITY_ACTION, "The Bar Chart needs one or two splits", categoricalDimensions.slice(0, 2).map((dimension) => {
        return {
            description: `Split on ${dimension.title} instead`,
            adjustment: {
                splits: splits_1.Splits.fromSplit(split_1.Split.fromDimension(dimension))
            }
        };
    }));
})
    .build();
exports.BAR_CHART_MANIFEST = new visualization_manifest_1.VisualizationManifest("bar-chart", "Bar Chart", rulesEvaluator, empty_settings_config_1.emptySettingsConfig);
//# sourceMappingURL=bar-chart.js.map