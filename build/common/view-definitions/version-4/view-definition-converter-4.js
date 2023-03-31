"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const essence_1 = require("../../models/essence/essence");
const filter_1 = require("../../models/filter/filter");
const splits_1 = require("../../models/splits/splits");
const time_shift_1 = require("../../models/time-shift/time-shift");
const general_1 = require("../../utils/general/general");
const visualization_manifests_1 = require("../../visualization-manifests");
const filter_definition_1 = require("./filter-definition");
const series_definition_1 = require("./series-definition");
const split_definition_1 = require("./split-definition");
const visualization_settings_converter_1 = require("./visualization-settings-converter");
class ViewDefinitionConverter4 {
    constructor() {
        this.version = 4;
    }
    fromViewDefinition(definition, appSettings, dataCube) {
        const timezone = chronoshift_1.Timezone.fromJS(definition.timezone);
        const visualization = visualization_manifests_1.manifestByName(definition.visualization);
        const visualizationSettings = visualization_settings_converter_1.fromViewDefinition(visualization, definition.visualizationSettings);
        const timeShift = definition.timeShift ? time_shift_1.TimeShift.fromJS(definition.timeShift) : time_shift_1.TimeShift.empty();
        const clauses = definition.filters
            .map(fc => {
            try {
                return filter_definition_1.filterDefinitionConverter.toFilterClause(fc, dataCube);
            }
            catch (e) {
                return null;
            }
        })
            .filter(general_1.isTruthy);
        const filter = filter_1.Filter.fromClauses(clauses);
        const splitDefinitions = definition.splits
            .map(sd => {
            try {
                return split_definition_1.splitConverter.toSplitCombine(sd, dataCube);
            }
            catch (e) {
                return null;
            }
        })
            .filter(general_1.isTruthy);
        const splits = new splits_1.Splits({ splits: immutable_1.List(splitDefinitions) });
        const pinnedDimensions = immutable_1.OrderedSet(definition.pinnedDimensions || []);
        const pinnedSort = definition.pinnedSort;
        const series = series_definition_1.seriesDefinitionConverter.toEssenceSeries(definition.series, dataCube.measures);
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
        return {
            visualization: essence.visualization.name,
            visualizationSettings: visualization_settings_converter_1.toViewDefinition(essence.visualization, essence.visualizationSettings),
            timezone: essence.timezone.toJS(),
            filters: essence.filter.clauses.map(fc => filter_definition_1.filterDefinitionConverter.fromFilterClause(fc)).toArray(),
            splits: essence.splits.splits.map(split_definition_1.splitConverter.fromSplitCombine).toArray(),
            series: series_definition_1.seriesDefinitionConverter.fromEssenceSeries(essence.series),
            pinnedDimensions: essence.pinnedDimensions.toArray(),
            pinnedSort: essence.pinnedSort,
            timeShift: essence.hasComparison() ? essence.timeShift.toJS() : undefined
        };
    }
}
exports.ViewDefinitionConverter4 = ViewDefinitionConverter4;
//# sourceMappingURL=view-definition-converter-4.js.map