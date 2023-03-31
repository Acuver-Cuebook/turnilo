"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dimensions_1 = require("../../models/dimension/dimensions");
const splits_1 = require("../../models/splits/splits");
const visualization_manifest_1 = require("../../models/visualization-manifest/visualization-manifest");
const resolutions_1 = require("./resolutions");
class Actions {
    static ready(score = 10) {
        return () => visualization_manifest_1.Resolve.ready(score);
    }
    static manualDimensionSelection(message) {
        return ({ dataCube }) => {
            return visualization_manifest_1.Resolve.manual(visualization_manifest_1.HIGH_PRIORITY_ACTION, message, resolutions_1.Resolutions.someDimensions(dataCube));
        };
    }
    static removeExcessiveSplits(visualizationName = "Visualization") {
        return ({ splits, dataCube }) => {
            const newSplits = splits.splits.take(dataCube.maxSplits);
            const excessiveSplits = splits.splits
                .skip(dataCube.maxSplits)
                .map(split => dimensions_1.findDimensionByName(dataCube.dimensions, split.reference).title);
            return visualization_manifest_1.Resolve.manual(visualization_manifest_1.NORMAL_PRIORITY_ACTION, `${visualizationName} supports only ${dataCube.maxSplits} splits`, [
                {
                    description: `Remove excessive splits: ${excessiveSplits.toArray().join(", ")}`,
                    adjustment: {
                        splits: splits_1.Splits.fromSplits(newSplits.toArray())
                    }
                }
            ]);
        };
    }
    static manualMeasuresSelection() {
        return ({ dataCube }) => {
            const selectDefault = resolutions_1.Resolutions.defaultSelectedMeasures(dataCube);
            const resolutions = selectDefault.length > 0 ? selectDefault : resolutions_1.Resolutions.firstMeasure(dataCube);
            return visualization_manifest_1.Resolve.manual(visualization_manifest_1.NORMAL_PRIORITY_ACTION, "At least one of the measures should be selected", resolutions);
        };
    }
}
exports.Actions = Actions;
//# sourceMappingURL=actions.js.map