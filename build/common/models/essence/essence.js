"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const app_settings_1 = require("../../../client/deserializers/app-settings");
const data_cube_1 = require("../../../client/deserializers/data-cube");
const functional_1 = require("../../utils/functional/functional");
const nullable_equals_1 = __importDefault(require("../../utils/immutable-utils/nullable-equals"));
const visualization_independent_evaluator_1 = require("../../utils/rules/visualization-independent-evaluator");
const time_1 = require("../../utils/time/time");
const visualization_manifests_1 = require("../../visualization-manifests");
const data_cube_2 = require("../data-cube/data-cube");
const date_range_1 = require("../date-range/date-range");
const dimensions_1 = require("../dimension/dimensions");
const filter_clause_1 = require("../filter-clause/filter-clause");
const measures_1 = require("../measure/measures");
const concrete_series_1 = require("../series/concrete-series");
const create_concrete_series_1 = __importDefault(require("../series/create-concrete-series"));
const sort_on_1 = require("../sort-on/sort-on");
const sort_1 = require("../sort/sort");
const splits_1 = require("../splits/splits");
const time_shift_1 = require("../time-shift/time-shift");
const time_shift_env_1 = require("../time-shift/time-shift-env");
const visualization_manifest_1 = require("../visualization-manifest/visualization-manifest");
function constrainDimensions(dimensions, dataCube) {
    return dimensions.filter(dimensionName => Boolean(dimensions_1.findDimensionByName(dataCube.dimensions, dimensionName)));
}
var VisStrategy;
(function (VisStrategy) {
    VisStrategy[VisStrategy["FairGame"] = 0] = "FairGame";
    VisStrategy[VisStrategy["UnfairGame"] = 1] = "UnfairGame";
    VisStrategy[VisStrategy["KeepAlways"] = 2] = "KeepAlways";
})(VisStrategy = exports.VisStrategy || (exports.VisStrategy = {}));
const defaultEssence = {
    appSettings: null,
    dataCube: null,
    visualization: null,
    visualizationSettings: null,
    timezone: new chronoshift_1.Timezone("Asia/Kolkata"),
    filter: null,
    splits: null,
    series: null,
    pinnedDimensions: immutable_1.OrderedSet([]),
    pinnedSort: null,
    timeShift: time_shift_1.TimeShift.empty(),
    visResolve: null
};
function resolveVisualization({ visualization, dataCube, splits, series, appSettings }) {
    let visResolve;
    if (!visualization) {
        const visAndResolve = Essence.getBestVisualization(appSettings, dataCube, splits, series, null);
        visualization = visAndResolve.visualization;
    }
    const ruleVariables = { appSettings, dataCube, series, splits, isSelectedVisualization: true };
    visResolve = visualization.evaluateRules(ruleVariables);
    if (visResolve.isAutomatic()) {
        const adjustment = visResolve.adjustment;
        splits = adjustment.splits;
        visResolve = visualization.evaluateRules({ ...ruleVariables, splits });
        if (!visResolve.isReady()) {
            throw new Error(visualization.title + " must be ready after automatic adjustment");
        }
    }
    if (visResolve.isReady()) {
        visResolve = visualization_independent_evaluator_1.visualizationIndependentEvaluator({ dataCube, series });
    }
    return { visualization, splits, visResolve };
}
class Essence extends immutable_1.Record(defaultEssence) {
    static getBestVisualization(appSettings, dataCube, splits, series, currentVisualization) {
        const visAndResolves = visualization_manifests_1.MANIFESTS.map(visualization => {
            const isSelectedVisualization = visualization === currentVisualization;
            const ruleVariables = { appSettings, dataCube, splits, series, isSelectedVisualization };
            return {
                visualization,
                resolve: visualization.evaluateRules(ruleVariables)
            };
        });
        return visAndResolves.sort((vr1, vr2) => visualization_manifest_1.Resolve.compare(vr1.resolve, vr2.resolve))[0];
    }
    static fromDataCube(dataCube, appSettings) {
        const essence = new Essence({
            appSettings,
            dataCube,
            visualization: null,
            visualizationSettings: null,
            timezone: dataCube.defaultTimezone,
            filter: data_cube_2.getDefaultFilter(dataCube),
            timeShift: time_shift_1.TimeShift.empty(),
            splits: data_cube_2.getDefaultSplits(dataCube),
            series: data_cube_2.getDefaultSeries(dataCube),
            pinnedDimensions: immutable_1.OrderedSet(dataCube.defaultPinnedDimensions),
            pinnedSort: dataCube.defaultSortMeasure
        });
        return essence.updateSplitsWithFilter();
    }
    static defaultSortReference(series, dataCube) {
        const seriesRefs = immutable_1.Set(series.series.map(series => series.key()));
        const defaultSort = dataCube.defaultSortMeasure;
        if (seriesRefs.has(defaultSort))
            return defaultSort;
        return seriesRefs.first();
    }
    static timeFilter(filter, dataCube) {
        const timeFilter = filter.getClauseForDimension(data_cube_2.getTimeDimension(dataCube));
        if (!filter_clause_1.isTimeFilter(timeFilter))
            throw new Error(`Unknown time filter: ${timeFilter}`);
        return timeFilter;
    }
    constructor(parameters) {
        const { filter, dataCube, timezone, timeShift, series, pinnedDimensions, pinnedSort } = parameters;
        if (!dataCube)
            throw new Error("Essence must have a dataCube");
        const { visResolve, visualization, splits } = resolveVisualization(parameters);
        const constrainedSeries = series && series.constrainToMeasures(dataCube.measures);
        const isPinnedSortValid = series && constrainedSeries.hasMeasureSeries(pinnedSort);
        const constrainedPinnedSort = isPinnedSortValid ? pinnedSort : Essence.defaultSortReference(constrainedSeries, dataCube);
        const constrainedFilter = filter.constrainToDimensions(dataCube.dimensions);
        const validTimezone = timezone || chronoshift_1.Timezone.UTC;
        const timeFilter = Essence.timeFilter(filter, dataCube);
        const constrainedTimeShift = timeShift.constrainToFilter(timeFilter, validTimezone);
        super({
            ...parameters,
            dataCube,
            visualization,
            timezone: validTimezone,
            timeShift: constrainedTimeShift,
            splits: splits && splits.constrainToDimensionsAndSeries(dataCube.dimensions, constrainedSeries),
            filter: constrainedFilter,
            series: constrainedSeries,
            pinnedDimensions: constrainDimensions(pinnedDimensions, dataCube),
            pinnedSort: constrainedPinnedSort,
            visResolve
        });
    }
    toString() {
        return "[Essence]";
    }
    toJS() {
        return {
            appSettings: app_settings_1.serialize(this.appSettings),
            visualization: this.visualization,
            visualizationSettings: this.visualizationSettings,
            dataCube: data_cube_1.serialize(this.dataCube),
            timezone: this.timezone.toJS(),
            filter: this.filter && this.filter.toJS(),
            splits: this.splits && this.splits.toJS(),
            series: this.series.toJS(),
            timeShift: this.timeShift.toJS(),
            pinnedSort: this.pinnedSort,
            pinnedDimensions: this.pinnedDimensions.toJS(),
            visResolve: this.visResolve
        };
    }
    getTimeDimension() {
        return data_cube_2.getTimeDimension(this.dataCube);
    }
    evaluateSelection(filter, timekeeper) {
        if (filter instanceof filter_clause_1.FixedTimeFilterClause)
            return filter;
        const { timezone, dataCube } = this;
        return filter.evaluate(timekeeper.now(), data_cube_2.getMaxTime(dataCube, timekeeper), timezone);
    }
    combineWithPrevious(filter) {
        const timeDimension = this.getTimeDimension();
        const timeFilter = filter.getClauseForDimension(timeDimension);
        if (!timeFilter || !(timeFilter instanceof filter_clause_1.FixedTimeFilterClause)) {
            throw new Error("Can't combine current time filter with previous period without time filter");
        }
        return filter.setClause(this.combinePeriods(timeFilter));
    }
    getTimeShiftEnv(timekeeper) {
        const timeDimension = this.getTimeDimension();
        if (!this.hasComparison()) {
            return { type: time_shift_env_1.TimeShiftEnvType.CURRENT };
        }
        const currentFilter = filter_clause_1.toExpression(this.currentTimeFilter(timekeeper), timeDimension);
        const previousFilter = filter_clause_1.toExpression(this.previousTimeFilter(timekeeper), timeDimension);
        return {
            type: time_shift_env_1.TimeShiftEnvType.WITH_PREVIOUS,
            shift: this.timeShift.valueOf(),
            currentFilter,
            previousFilter
        };
    }
    constrainTimeShift() {
        const { timeShift, timezone } = this;
        return this.set("timeShift", timeShift.constrainToFilter(this.timeFilter(), timezone));
    }
    getEffectiveFilter(timekeeper, { combineWithPrevious = false, unfilterDimension = null } = {}) {
        const { dataCube, timezone } = this;
        let filter = this.filter;
        if (unfilterDimension)
            filter = filter.removeClause(unfilterDimension.name);
        filter = filter.getSpecificFilter(timekeeper.now(), data_cube_2.getMaxTime(dataCube, timekeeper), timezone);
        if (combineWithPrevious) {
            filter = this.combineWithPrevious(filter);
        }
        return filter;
    }
    hasComparison() {
        return !this.timeShift.isEmpty();
    }
    combinePeriods(timeFilter) {
        const { timezone, timeShift } = this;
        const duration = timeShift.valueOf();
        return timeFilter.update("values", values => values.flatMap(({ start, end }) => [
            new date_range_1.DateRange({ start, end }),
            new date_range_1.DateRange({ start: duration.shift(start, timezone, -1), end: duration.shift(end, timezone, -1) })
        ]));
    }
    timeFilter() {
        const { filter, dataCube } = this;
        return Essence.timeFilter(filter, dataCube);
    }
    fixedTimeFilter(timekeeper) {
        const { dataCube, timezone } = this;
        const timeFilter = this.timeFilter();
        if (timeFilter instanceof filter_clause_1.FixedTimeFilterClause)
            return timeFilter;
        return timeFilter.evaluate(timekeeper.now(), data_cube_2.getMaxTime(dataCube, timekeeper), timezone);
    }
    currentTimeFilter(timekeeper) {
        return this.fixedTimeFilter(timekeeper);
    }
    shiftToPrevious(timeFilter) {
        const { timezone, timeShift } = this;
        const duration = timeShift.valueOf();
        return timeFilter.update("values", values => values.map(({ start, end }) => new date_range_1.DateRange({
            start: duration.shift(start, timezone, -1),
            end: duration.shift(end, timezone, -1)
        })));
    }
    previousTimeFilter(timekeeper) {
        const timeFilter = this.fixedTimeFilter(timekeeper);
        return this.shiftToPrevious(timeFilter);
    }
    getTimeClause() {
        const timeDimension = this.getTimeDimension();
        return this.filter.getClauseForDimension(timeDimension);
    }
    concreteSeriesFromSeries(series) {
        const { reference } = series;
        const { dataCube } = this;
        const measure = measures_1.findMeasureByName(dataCube.measures, reference);
        return create_concrete_series_1.default(series, measure, dataCube.measures);
    }
    findConcreteSeries(key) {
        const series = this.series.series.find(series => series.key() === key);
        if (!series)
            return null;
        return this.concreteSeriesFromSeries(series);
    }
    getConcreteSeries() {
        return this.series.series.map(series => this.concreteSeriesFromSeries(series));
    }
    differentDataCube(other) {
        return this.dataCube !== other.dataCube;
    }
    differentSplits(other) {
        return !this.splits.equals(other.splits);
    }
    differentTimeShift(other) {
        return !this.timeShift.equals(other.timeShift);
    }
    differentSeries(other) {
        return !this.series.equals(other.series);
    }
    differentSettings(other) {
        return !nullable_equals_1.default(this.visualizationSettings, other.visualizationSettings);
    }
    differentEffectiveFilter(other, myTimekeeper, otherTimekeeper, unfilterDimension = null) {
        const myEffectiveFilter = this.getEffectiveFilter(myTimekeeper, { unfilterDimension });
        const otherEffectiveFilter = other.getEffectiveFilter(otherTimekeeper, { unfilterDimension });
        return !myEffectiveFilter.equals(otherEffectiveFilter);
    }
    getCommonSort() {
        return this.splits.getCommonSort();
    }
    changeComparisonShift(timeShift) {
        return this
            .set("timeShift", timeShift)
            .constrainTimeShift()
            .updateSorts();
    }
    updateDataCube(newDataCube) {
        const { dataCube } = this;
        if (dataCube.name === newDataCube.name)
            return this;
        function setDataCube(essence) {
            return essence.set("dataCube", newDataCube);
        }
        function constrainProps(essence) {
            const seriesValidInNewCube = essence.series.constrainToMeasures(newDataCube.measures);
            const newSeriesList = !seriesValidInNewCube.isEmpty()
                ? seriesValidInNewCube
                : data_cube_2.getDefaultSeries(newDataCube);
            return essence
                .update("filter", filter => filter.constrainToDimensions(newDataCube.dimensions))
                .set("series", newSeriesList)
                .update("splits", splits => splits.constrainToDimensionsAndSeries(newDataCube.dimensions, newSeriesList))
                .update("pinnedDimensions", pinned => constrainDimensions(pinned, newDataCube))
                .update("pinnedSort", sort => !measures_1.hasMeasureWithName(newDataCube.measures, sort) ? newDataCube.defaultSortMeasure : sort);
        }
        function adjustVisualization(essence) {
            const { dataCube, visualization, splits, series, appSettings } = essence;
            const { visualization: newVis } = Essence.getBestVisualization(appSettings, dataCube, splits, series, visualization);
            if (newVis === visualization)
                return essence;
            return essence.changeVisualization(newVis, newVis.visualizationSettings.defaults);
        }
        return functional_1.thread(this, setDataCube, constrainProps, adjustVisualization, (essence) => essence.resolveVisualizationAndUpdate());
    }
    changeFilter(filter) {
        const { filter: oldFilter } = this;
        return this
            .set("filter", filter)
            .constrainTimeShift()
            .update("splits", splits => {
            const differentClauses = filter.clauses.filter(clause => {
                const otherClause = oldFilter.clauseForReference(clause.reference);
                return !clause.equals(otherClause);
            });
            return splits.removeBucketingFrom(immutable_1.Set(differentClauses.map(clause => clause.reference)));
        })
            .updateSplitsWithFilter();
    }
    changeTimezone(newTimezone) {
        const { timezone } = this;
        if (timezone === newTimezone)
            return this;
        return this.set("timezone", newTimezone);
    }
    convertToSpecificFilter(timekeeper) {
        const { dataCube, filter, timezone } = this;
        if (!filter.isRelative())
            return this;
        return this.changeFilter(filter.getSpecificFilter(timekeeper.now(), data_cube_2.getMaxTime(dataCube, timekeeper), timezone));
    }
    defaultSplitSort(split) {
        const { dataCube, series } = this;
        const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.reference);
        const { sortStrategy, name, kind } = dimension;
        if (sortStrategy === "self" || sortStrategy === name) {
            return new sort_1.DimensionSort({ reference: name, direction: sort_1.SortDirection.ascending });
        }
        if (sortStrategy && series.hasMeasureSeries(sortStrategy)) {
            return new sort_1.SeriesSort({ reference: sortStrategy, direction: sort_1.SortDirection.descending });
        }
        if (kind === "time") {
            return new sort_1.DimensionSort({ reference: name, direction: sort_1.SortDirection.ascending });
        }
        return new sort_1.SeriesSort({ reference: this.defaultSort(), direction: sort_1.SortDirection.descending });
    }
    setSortOnSplits(splits) {
        return splits.update("splits", list => list.map(split => {
            return sort_1.isSortEmpty(split.sort) ? split.set("sort", this.defaultSplitSort(split)) : split;
        }));
    }
    changeSplits(splits, strategy) {
        const { splits: oldSplits, appSettings, dataCube, visualization, visResolve, filter, series } = this;
        const newSplits = this.setSortOnSplits(splits).updateWithFilter(filter, dataCube.dimensions);
        function adjustStrategy(strategy) {
            if (visResolve.isManual()) {
                return VisStrategy.KeepAlways;
            }
            if (oldSplits.length() > 0 && newSplits.length() !== 0) {
                return VisStrategy.UnfairGame;
            }
            return strategy;
        }
        function adjustVisualization(essence) {
            if (adjustStrategy(strategy) !== VisStrategy.FairGame)
                return essence;
            const { visualization: newVis } = Essence.getBestVisualization(appSettings, dataCube, newSplits, series, visualization);
            if (newVis === visualization)
                return essence;
            return essence.changeVisualization(newVis, newVis.visualizationSettings.defaults);
        }
        return functional_1.thread(this, (essence) => essence.set("splits", newSplits), adjustVisualization, (essence) => essence.resolveVisualizationAndUpdate());
    }
    changeSplit(splitCombine, strategy) {
        return this.changeSplits(splits_1.Splits.fromSplit(splitCombine), strategy);
    }
    addSplit(split, strategy) {
        return this.changeSplits(this.splits.addSplit(split), strategy);
    }
    removeSplit(split, strategy) {
        return this.changeSplits(this.splits.removeSplit(split), strategy);
    }
    addSeries(series) {
        return this.changeSeriesList(this.series.addSeries(series));
    }
    removeSeries(series) {
        return this.changeSeriesList(this.series.removeSeries(series));
    }
    changeSeriesList(series) {
        return this
            .set("series", series)
            .updateSorts()
            .resolveVisualizationAndUpdate();
    }
    defaultSort() {
        return Essence.defaultSortReference(this.series, this.dataCube);
    }
    updateSorts() {
        const seriesRefs = immutable_1.Set(this.series.series.map(series => series.reference));
        return this
            .update("pinnedSort", sort => {
            if (seriesRefs.has(sort))
                return sort;
            return this.defaultSort();
        })
            .update("splits", splits => splits.update("splits", splits => splits.map((split) => {
            const { sort } = split;
            const { type, reference } = sort;
            switch (type) {
                case sort_1.SortType.DIMENSION:
                    return split;
                case sort_1.SortType.SERIES: {
                    const measureSort = sort;
                    if (!seriesRefs.has(reference)) {
                        const measureSortRef = this.defaultSort();
                        if (measureSortRef) {
                            return split.changeSort(new sort_1.SeriesSort({
                                reference: measureSortRef
                            }));
                        }
                        return split.changeSort(new sort_1.DimensionSort({
                            reference: split.reference
                        }));
                    }
                    if (measureSort.period !== concrete_series_1.SeriesDerivation.CURRENT && !this.hasComparison()) {
                        return split.update("sort", (sort) => sort.set("period", concrete_series_1.SeriesDerivation.CURRENT));
                    }
                    return split;
                }
            }
        })));
    }
    updateSplitsWithFilter() {
        const { filter, dataCube: { dimensions }, splits } = this;
        const newSplits = splits.updateWithFilter(filter, dimensions);
        if (splits === newSplits)
            return this;
        return this.set("splits", newSplits).resolveVisualizationAndUpdate();
    }
    changeVisualization(visualization, settings = visualization.visualizationSettings.defaults) {
        return this
            .set("visualization", visualization)
            .set("visualizationSettings", settings)
            .resolveVisualizationAndUpdate();
    }
    resolveVisualizationAndUpdate() {
        const { visualization, splits, dataCube, series, appSettings } = this;
        const result = resolveVisualization({ appSettings, dataCube, visualization, splits, series });
        return this
            .set("visResolve", result.visResolve)
            .set("visualization", result.visualization)
            .set("splits", result.splits);
    }
    pin({ name }) {
        return this.update("pinnedDimensions", pinned => pinned.add(name));
    }
    unpin({ name }) {
        return this.update("pinnedDimensions", pinned => pinned.remove(name));
    }
    changePinnedSortSeries(series) {
        return this.set("pinnedSort", series.plywoodKey());
    }
    seriesSortOns(withTimeShift) {
        const series = this.getConcreteSeries();
        const addPrevious = withTimeShift && this.hasComparison();
        if (!addPrevious)
            return series.map(series => new sort_on_1.SeriesSortOn(series));
        return series.flatMap(series => {
            return [
                new sort_on_1.SeriesSortOn(series),
                new sort_on_1.SeriesSortOn(series, concrete_series_1.SeriesDerivation.PREVIOUS),
                new sort_on_1.SeriesSortOn(series, concrete_series_1.SeriesDerivation.DELTA)
            ];
        });
    }
    getPinnedSortSeries() {
        return this.findConcreteSeries(this.pinnedSort);
    }
    description(timekeeper) {
        const timeFilter = this.currentTimeFilter(timekeeper);
        const { start, end } = timeFilter.values.first();
        const timezone = this.timezone;
        return `${this.dataCube.name}_${time_1.formatUrlSafeDateTime(start, timezone)}_${time_1.formatUrlSafeDateTime(end, timezone)}`;
    }
}
exports.Essence = Essence;
//# sourceMappingURL=essence.js.map