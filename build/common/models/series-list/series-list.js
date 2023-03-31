"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const general_1 = require("../../utils/general/general");
const concreteArithmeticOperation_1 = require("../expression/concreteArithmeticOperation");
const measures_1 = require("../measure/measures");
const expression_series_1 = require("../series/expression-series");
const measure_series_1 = require("../series/measure-series");
const series_1 = require("../series/series");
const defaultSeriesList = { series: immutable_1.List([]) };
class SeriesList extends immutable_1.Record(defaultSeriesList) {
    static fromMeasures(measures) {
        const series = immutable_1.List(measures.map(series_1.fromMeasure));
        return new SeriesList({ series });
    }
    static fromJS(seriesDefs, measures) {
        const series = immutable_1.List(seriesDefs.map(def => {
            const measure = measures_1.findMeasureByName(measures, def.reference);
            return series_1.fromJS(def, measure);
        }));
        return new SeriesList({ series });
    }
    static fromSeries(series) {
        return new SeriesList({ series: immutable_1.List(series) });
    }
    static validSeries(series, measures) {
        if (series instanceof expression_series_1.ExpressionSeries && series.expression instanceof concreteArithmeticOperation_1.ArithmeticExpression) {
            return measures_1.hasMeasureWithName(measures, series.reference) && measures_1.hasMeasureWithName(measures, series.expression.reference);
        }
        return measures_1.hasMeasureWithName(measures, series.reference);
    }
    addSeries(newSeries) {
        const { series } = this;
        return this.insertByIndex(series.count(), newSeries);
    }
    removeSeries(series) {
        return this.updateSeries(list => list.filter(s => s.key() !== series.key()));
    }
    replaceSeries(original, newSeries) {
        return this.updateSeries(series => {
            const idx = series.findIndex(s => s.equals(original));
            if (idx === -1)
                throw new Error(`Couldn't replace series because couldn't find original: ${original}`);
            return series.set(idx, newSeries);
        });
    }
    replaceByIndex(index, replace) {
        const { series } = this;
        if (series.count() === index) {
            return this.insertByIndex(index, replace);
        }
        return this.updateSeries(series => {
            const newSeriesIndex = series.findIndex(split => split.equals(replace));
            if (newSeriesIndex === -1)
                return series.set(index, replace);
            const oldSplit = series.get(index);
            return series
                .set(index, replace)
                .set(newSeriesIndex, oldSplit);
        });
    }
    insertByIndex(index, insert) {
        return this.updateSeries(list => list
            .insert(index, insert)
            .filterNot((series, idx) => series.equals(insert) && idx !== index));
    }
    hasMeasureSeries(reference) {
        const series = this.getSeries(reference);
        return series && series instanceof measure_series_1.MeasureSeries;
    }
    hasMeasure({ name }) {
        return this.hasMeasureSeries(name);
    }
    getSeries(reference) {
        return this.series.find(series => series.reference === reference);
    }
    constrainToMeasures(measures) {
        return this.updateSeries(list => list.filter(series => SeriesList.validSeries(series, measures)));
    }
    count() {
        return this.series.count();
    }
    isEmpty() {
        return this.series.isEmpty();
    }
    updateSeries(updater) {
        return this.update("series", updater);
    }
    hasSeries(series) {
        return this.series.find(s => s.equals(series)) !== undefined;
    }
    hasSeriesWithKey(key) {
        return general_1.isTruthy(this.getSeriesWithKey(key));
    }
    getSeriesWithKey(key) {
        return this.series.find(series => series.key() === key);
    }
    takeFirst() {
        return this.updateSeries(series => series.take(1));
    }
    takeNFirst(number) {
        return this.updateSeries(series => series.take(number));
    }
    getExpressionSeriesFor(reference) {
        return this.series.filter(series => series.reference === reference && series instanceof expression_series_1.ExpressionSeries);
    }
    getSeriesKeys() {
        return this.series.map(series => series.key());
    }
}
exports.SeriesList = SeriesList;
exports.EMPTY_SERIES = new SeriesList({ series: immutable_1.List([]) });
//# sourceMappingURL=series-list.js.map