"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const essence_1 = require("../../models/essence/essence");
const filter_1 = require("../../models/filter/filter");
const splits_1 = require("../../models/splits/splits");
const time_shift_1 = require("../../models/time-shift/time-shift");
const visualization_manifests_1 = require("../../visualization-manifests");
const filter_definition_1 = require("../version-4/filter-definition");
const split_definition_1 = require("../version-4/split-definition");
const measures_definition_1 = require("./measures-definition");
class ViewDefinitionConverter3 {
    constructor() {
        this.version = 3;
    }
    fromViewDefinition(definition, appSettings, dataCube) {
        const timezone = chronoshift_1.Timezone.fromJS(definition.timezone);
        const visualization = visualization_manifests_1.manifestByName(definition.visualization);
        const visualizationSettings = visualization.visualizationSettings.defaults;
        const timeShift = definition.timeShift ? time_shift_1.TimeShift.fromJS(definition.timeShift) : time_shift_1.TimeShift.empty();
        const filter = filter_1.Filter.fromClauses(definition.filters.map(fc => filter_definition_1.filterDefinitionConverter.toFilterClause(fc, dataCube)));
        const splitDefinitions = immutable_1.List(definition.splits);
        const splits = new splits_1.Splits({ splits: splitDefinitions.map(sd => split_definition_1.splitConverter.toSplitCombine(sd, dataCube)) });
        const pinnedDimensions = immutable_1.OrderedSet(definition.pinnedDimensions || []);
        const pinnedSort = definition.pinnedSort;
        const series = measures_definition_1.seriesDefinitionConverter.toEssenceSeries(definition.measures, dataCube.measures);
        return new essence_1.Essence({
            appSettings,
            dataCube,
            visualization,
            visualizationSettings,
            timezone,
            filter,
            timeShift,
            splits,
            pinnedDimensions,
            series,
            pinnedSort
        });
    }
    toViewDefinition(essence) {
        throw new Error("toViewDefinition is not supported in Version 3");
    }
}
exports.ViewDefinitionConverter3 = ViewDefinitionConverter3;
//# sourceMappingURL=view-definition-converter-3.js.map