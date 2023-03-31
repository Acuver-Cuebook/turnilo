"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const data_cube_1 = require("../../models/data-cube/data-cube");
const dimensions_1 = require("../../models/dimension/dimensions");
const sort_1 = require("../../models/sort/sort");
const split_1 = require("../../models/split/split");
const splits_1 = require("../../models/splits/splits");
const visualization_manifest_1 = require("../../models/visualization-manifest/visualization-manifest");
const predicates_1 = require("../../utils/rules/predicates");
const split_adjustments_1 = require("../../utils/rules/split-adjustments");
const visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
const settings_1 = require("./settings");
const rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(({ dataCube }) => !(data_cube_1.getDimensionsByKind(dataCube, "time").length || data_cube_1.getDimensionsByKind(dataCube, "number").length))
    .then(() => visualization_manifest_1.Resolve.NEVER)
    .when(predicates_1.Predicates.noSplits())
    .then(({ dataCube }) => {
    const continuousDimensions = data_cube_1.getDimensionsByKind(dataCube, "time").concat(data_cube_1.getDimensionsByKind(dataCube, "number"));
    return visualization_manifest_1.Resolve.manual(visualization_manifest_1.NORMAL_PRIORITY_ACTION, "This visualization requires a continuous dimension split", continuousDimensions.map(continuousDimension => {
        return {
            description: `Add a split on ${continuousDimension.title}`,
            adjustment: {
                splits: splits_1.Splits.fromSplit(split_1.Split.fromDimension(continuousDimension))
            }
        };
    }));
})
    .when(predicates_1.Predicates.areExactSplitKinds("time"))
    .then(({ splits, isSelectedVisualization }) => {
    const timeSplit = splits.getSplit(0);
    const newTimeSplit = split_adjustments_1.adjustContinuousSplit(timeSplit);
    if (timeSplit.equals(newTimeSplit))
        return visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 7);
    return visualization_manifest_1.Resolve.automatic(7, { splits: new splits_1.Splits({ splits: immutable_1.List([newTimeSplit]) }) });
})
    .when(predicates_1.Predicates.areExactSplitKinds("number"))
    .then(({ splits, isSelectedVisualization }) => {
    const numberSplit = splits.getSplit(0);
    const newContinuousSplit = split_adjustments_1.adjustContinuousSplit(numberSplit);
    if (newContinuousSplit.equals(numberSplit))
        return visualization_manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 4);
    return visualization_manifest_1.Resolve.automatic(4, { splits: new splits_1.Splits({ splits: immutable_1.List([newContinuousSplit]) }) });
})
    .when(predicates_1.Predicates.areExactSplitKinds("time", "*"))
    .then(({ splits, series, dataCube, appSettings }) => {
    const timeSplit = splits.getSplit(0);
    const newTimeSplit = timeSplit
        .changeSort(new sort_1.DimensionSort({ reference: timeSplit.reference, direction: sort_1.SortDirection.ascending }))
        .changeLimit(null);
    const colorSplit = splits.getSplit(1);
    const colorDimension = dimensions_1.findDimensionByName(dataCube.dimensions, colorSplit.reference);
    const newColorSplit = split_adjustments_1.adjustColorSplit(colorSplit, colorDimension, series, appSettings.customization.visualizationColors);
    return visualization_manifest_1.Resolve.automatic(8, {
        splits: new splits_1.Splits({ splits: immutable_1.List([newColorSplit, newTimeSplit]) })
    });
})
    .when(predicates_1.Predicates.areExactSplitKinds("number", "*"))
    .then(({ splits, series, dataCube, appSettings }) => {
    const numberSplit = splits.getSplit(0);
    const newNumberSplit = split_adjustments_1.adjustContinuousSplit(numberSplit);
    const colorSplit = splits.getSplit(1);
    const colorDimension = dimensions_1.findDimensionByName(dataCube.dimensions, colorSplit.reference);
    const newColorSplit = split_adjustments_1.adjustColorSplit(colorSplit, colorDimension, series, appSettings.customization.visualizationColors);
    return visualization_manifest_1.Resolve.automatic(8, {
        splits: new splits_1.Splits({ splits: immutable_1.List([newColorSplit, newNumberSplit]) })
    });
})
    .when(predicates_1.Predicates.areExactSplitKinds("*", "time"))
    .then(({ splits, series, dataCube, appSettings }) => {
    const timeSplit = splits.getSplit(1);
    const newTimeSplit = split_adjustments_1.adjustContinuousSplit(timeSplit);
    const colorSplit = splits.getSplit(0);
    const colorDimension = dimensions_1.findDimensionByName(dataCube.dimensions, colorSplit.reference);
    const newColorSplit = split_adjustments_1.adjustColorSplit(colorSplit, colorDimension, series, appSettings.customization.visualizationColors);
    const newSplits = new splits_1.Splits({ splits: immutable_1.List([newColorSplit, newTimeSplit]) });
    if (newSplits.equals(splits))
        return visualization_manifest_1.Resolve.ready(10);
    return visualization_manifest_1.Resolve.automatic(8, { splits: newSplits });
})
    .when(predicates_1.Predicates.areExactSplitKinds("*", "number"))
    .then(({ splits, dataCube, series, appSettings }) => {
    const numberSplit = splits.getSplit(1);
    const newNumberSplit = split_adjustments_1.adjustContinuousSplit(numberSplit);
    const colorSplit = splits.getSplit(0);
    const colorDimension = dimensions_1.findDimensionByName(dataCube.dimensions, colorSplit.reference);
    const newColorSplit = split_adjustments_1.adjustColorSplit(colorSplit, colorDimension, series, appSettings.customization.visualizationColors);
    const newSplits = new splits_1.Splits({ splits: immutable_1.List([newColorSplit, newNumberSplit]) });
    if (newSplits.equals(splits))
        return visualization_manifest_1.Resolve.ready(10);
    return visualization_manifest_1.Resolve.automatic(8, { splits: newSplits });
})
    .when(predicates_1.Predicates.haveAtLeastSplitKinds("time"))
    .then(({ splits, dataCube }) => {
    const timeSplit = splits.splits.find(split => dimensions_1.findDimensionByName(dataCube.dimensions, split.reference).kind === "time");
    return visualization_manifest_1.Resolve.manual(visualization_manifest_1.NORMAL_PRIORITY_ACTION, "Too many splits on the line chart", [
        {
            description: "Remove all but the time split",
            adjustment: {
                splits: splits_1.Splits.fromSplit(timeSplit)
            }
        }
    ]);
})
    .otherwise(({ dataCube }) => {
    const continuousDimensions = data_cube_1.getDimensionsByKind(dataCube, "time").concat(data_cube_1.getDimensionsByKind(dataCube, "number"));
    return visualization_manifest_1.Resolve.manual(visualization_manifest_1.NORMAL_PRIORITY_ACTION, "The Line Chart needs one continuous dimension split", continuousDimensions.map(continuousDimension => {
        return {
            description: `Split on ${continuousDimension.title} instead`,
            adjustment: {
                splits: splits_1.Splits.fromSplit(split_1.Split.fromDimension(continuousDimension))
            }
        };
    }));
})
    .build();
exports.LINE_CHART_MANIFEST = new visualization_manifest_1.VisualizationManifest("line-chart", "Line Chart", rulesEvaluator, settings_1.settings);
//# sourceMappingURL=line-chart.js.map