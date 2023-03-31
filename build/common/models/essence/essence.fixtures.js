"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const heat_map_1 = require("../../visualization-manifests/heat-map/heat-map");
const line_chart_1 = require("../../visualization-manifests/line-chart/line-chart");
const table_1 = require("../../visualization-manifests/table/table");
const totals_1 = require("../../visualization-manifests/totals/totals");
const app_settings_fixtures_1 = require("../app-settings/app-settings.fixtures");
const data_cube_fixtures_1 = require("../data-cube/data-cube.fixtures");
const filter_clause_1 = require("../filter-clause/filter-clause");
const filter_clause_fixtures_1 = require("../filter-clause/filter-clause.fixtures");
const filter_1 = require("../filter/filter");
const series_list_1 = require("../series-list/series-list");
const series_fixtures_1 = require("../series/series.fixtures");
const sort_1 = require("../sort/sort");
const split_fixtures_1 = require("../split/split.fixtures");
const splits_1 = require("../splits/splits");
const time_shift_1 = require("../time-shift/time-shift");
const essence_1 = require("./essence");
const defaultEssence = {
    appSettings: app_settings_fixtures_1.clientAppSettings,
    dataCube: data_cube_fixtures_1.customClientCube("essence-fixture-data-cube", "essence-fixture-data-cube"),
    visualization: null,
    visualizationSettings: null,
    timezone: new chronoshift_1.Timezone("Asia/Kolkata"),
    pinnedDimensions: immutable_1.OrderedSet([]),
    filter: new filter_1.Filter({
        clauses: immutable_1.List([
            new filter_clause_1.NumberFilterClause({ reference: "commentLength", values: immutable_1.List.of(new filter_clause_1.NumberRange({ start: 1, end: 100 })) }),
            new filter_clause_1.RelativeTimeFilterClause({ reference: "time", period: filter_clause_1.TimeFilterPeriod.LATEST, duration: chronoshift_1.Duration.fromJS("P1D") })
        ])
    }),
    pinnedSort: null,
    splits: splits_1.EMPTY_SPLITS,
    timeShift: time_shift_1.TimeShift.empty(),
    series: series_list_1.EMPTY_SERIES
};
class EssenceFixtures {
    static noViz() {
        return {
            ...defaultEssence,
            visualization: totals_1.TOTALS_MANIFEST,
            series: series_list_1.SeriesList.fromSeries([series_fixtures_1.measureSeries("count")])
        };
    }
    static totals() {
        return {
            ...defaultEssence,
            visualization: totals_1.TOTALS_MANIFEST
        };
    }
    static lineChart() {
        return {
            ...defaultEssence,
            visualization: line_chart_1.LINE_CHART_MANIFEST
        };
    }
    static getWikiContext() {
        return {
            dataCube: data_cube_fixtures_1.wikiClientDataCube
        };
    }
    static getTwitterContext() {
        return {
            dataCube: data_cube_fixtures_1.twitterClientDataCube
        };
    }
    static wikiHeatmap() {
        const filterClauses = [
            filter_clause_fixtures_1.timeRange("time", new Date("2015-09-12T00:00:00Z"), new Date("2015-09-13T00:00:00Z"))
        ];
        const splitCombines = [
            split_fixtures_1.stringSplitCombine("channel", { sort: { reference: "added", direction: sort_1.SortDirection.descending }, limit: 50 }),
            split_fixtures_1.stringSplitCombine("namespace", { sort: { reference: "added", direction: sort_1.SortDirection.descending }, limit: 5 })
        ];
        return new essence_1.Essence({
            appSettings: app_settings_fixtures_1.clientAppSettings,
            dataCube: data_cube_fixtures_1.wikiClientDataCube,
            visualization: heat_map_1.HEAT_MAP_MANIFEST,
            visualizationSettings: heat_map_1.HEAT_MAP_MANIFEST.visualizationSettings.defaults,
            timezone: chronoshift_1.Timezone.fromJS("Etc/UTC"),
            timeShift: time_shift_1.TimeShift.empty(),
            filter: filter_1.Filter.fromClauses(filterClauses),
            splits: new splits_1.Splits({ splits: immutable_1.List(splitCombines) }),
            series: series_list_1.SeriesList.fromSeries([series_fixtures_1.measureSeries("added")]),
            pinnedDimensions: immutable_1.OrderedSet(["channel", "namespace", "isRobot"]),
            pinnedSort: "delta"
        });
    }
    static wikiTable() {
        const filterClauses = [
            filter_clause_fixtures_1.timeRange("time", new Date("2015-09-12T00:00:00Z"), new Date("2015-09-13T00:00:00Z")),
            filter_clause_fixtures_1.stringIn("channel", ["en"]),
            filter_clause_fixtures_1.boolean("isRobot", [true], true),
            filter_clause_fixtures_1.stringContains("page", "Jeremy", false),
            filter_clause_fixtures_1.stringMatch("userChars", "^A$", false),
            filter_clause_fixtures_1.numberRange("commentLength", 3, null, "[)", false)
        ];
        const splitCombines = [
            split_fixtures_1.stringSplitCombine("channel", { sort: { reference: "delta", direction: sort_1.SortDirection.descending }, limit: 50 }),
            split_fixtures_1.booleanSplitCombine("isRobot", { sort: { reference: "delta", direction: sort_1.SortDirection.descending }, limit: 5 }),
            split_fixtures_1.numberSplitCombine("commentLength", 10, { sort: { reference: "delta", direction: sort_1.SortDirection.descending }, limit: 5 }),
            split_fixtures_1.timeSplitCombine("time", "PT1H", { sort: { reference: "delta", direction: sort_1.SortDirection.descending }, limit: null })
        ];
        const series = [
            series_fixtures_1.measureSeries("delta"),
            series_fixtures_1.measureSeries("count"),
            series_fixtures_1.measureSeries("added")
        ];
        return new essence_1.Essence({
            appSettings: app_settings_fixtures_1.clientAppSettings,
            dataCube: data_cube_fixtures_1.wikiClientDataCube,
            visualization: table_1.TABLE_MANIFEST,
            visualizationSettings: table_1.TABLE_MANIFEST.visualizationSettings.defaults,
            timezone: chronoshift_1.Timezone.fromJS("Etc/UTC"),
            timeShift: time_shift_1.TimeShift.empty(),
            filter: filter_1.Filter.fromClauses(filterClauses),
            splits: new splits_1.Splits({ splits: immutable_1.List(splitCombines) }),
            series: series_list_1.SeriesList.fromSeries(series),
            pinnedDimensions: immutable_1.OrderedSet(["channel", "namespace", "isRobot"]),
            pinnedSort: "delta"
        });
    }
    static wikiLineChart() {
        const filterClauses = [
            filter_clause_fixtures_1.timePeriod("time", "P1D", filter_clause_1.TimeFilterPeriod.LATEST),
            filter_clause_fixtures_1.stringIn("channel", ["en", "no", "sv", "de", "fr", "cs"])
        ];
        const splitCombines = [
            split_fixtures_1.stringSplitCombine("channel", { sort: { reference: "delta", direction: sort_1.SortDirection.descending }, limit: 50 }),
            split_fixtures_1.timeSplitCombine("time", "PT1H", { sort: { reference: "delta", direction: sort_1.SortDirection.descending }, limit: null })
        ];
        const series = [
            series_fixtures_1.measureSeries("delta"),
            series_fixtures_1.measureSeries("count"),
            series_fixtures_1.measureSeries("added")
        ];
        return new essence_1.Essence({
            appSettings: app_settings_fixtures_1.clientAppSettings,
            dataCube: data_cube_fixtures_1.wikiClientDataCube,
            visualization: line_chart_1.LINE_CHART_MANIFEST,
            visualizationSettings: line_chart_1.LINE_CHART_MANIFEST.visualizationSettings.defaults,
            timezone: chronoshift_1.Timezone.fromJS("Etc/UTC"),
            timeShift: time_shift_1.TimeShift.empty(),
            filter: filter_1.Filter.fromClauses(filterClauses),
            splits: new splits_1.Splits({ splits: immutable_1.List(splitCombines) }),
            series: series_list_1.SeriesList.fromSeries(series),
            pinnedDimensions: immutable_1.OrderedSet(["channel", "namespace", "isRobot"]),
            pinnedSort: "delta"
        });
    }
    static wikiTotals() {
        return new essence_1.Essence({ ...EssenceFixtures.totals(), ...EssenceFixtures.getWikiContext() });
    }
    static wikiLineChartNoNominalSplit() {
        const essence = EssenceFixtures.wikiLineChart();
        const split = essence.splits.getSplit(0);
        return essence.removeSplit(split, essence_1.VisStrategy.FairGame);
    }
    static wikiLineChartNoSplits() {
        const essence = EssenceFixtures.wikiLineChart();
        return essence.changeSplits(splits_1.Splits.fromSplits([]), essence_1.VisStrategy.KeepAlways);
    }
    static twitterNoVisualisation() {
        return new essence_1.Essence({ ...EssenceFixtures.noViz(), ...EssenceFixtures.getTwitterContext() });
    }
}
exports.EssenceFixtures = EssenceFixtures;
//# sourceMappingURL=essence.fixtures.js.map