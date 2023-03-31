"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const time_shift_env_1 = require("../time-shift/time-shift-env");
const series_format_1 = require("./series-format");
var SeriesDerivation;
(function (SeriesDerivation) {
    SeriesDerivation["CURRENT"] = "";
    SeriesDerivation["PREVIOUS"] = "_previous__";
    SeriesDerivation["DELTA"] = "_delta__";
})(SeriesDerivation = exports.SeriesDerivation || (exports.SeriesDerivation = {}));
class ConcreteSeries {
    constructor(definition, measure) {
        this.definition = definition;
        this.measure = measure;
    }
    equals(other) {
        return this.definition.equals(other.definition);
    }
    reactKey(derivation = SeriesDerivation.CURRENT) {
        switch (derivation) {
            case SeriesDerivation.CURRENT:
                return this.definition.key();
            case SeriesDerivation.PREVIOUS:
                return `${this.definition.key()}-previous`;
            case SeriesDerivation.DELTA:
                return `${this.definition.key()}-delta`;
        }
    }
    plywoodKey(period = SeriesDerivation.CURRENT) {
        return this.definition.plywoodKey(period);
    }
    plywoodExpression(nestingLevel, timeShiftEnv) {
        const { expression } = this.measure;
        switch (timeShiftEnv.type) {
            case time_shift_env_1.TimeShiftEnvType.CURRENT:
                return this.applyExpression(expression, this.definition.plywoodKey(), nestingLevel);
            case time_shift_env_1.TimeShiftEnvType.WITH_PREVIOUS: {
                const currentName = this.plywoodKey();
                const previousName = this.plywoodKey(SeriesDerivation.PREVIOUS);
                const current = this.filterMainRefs(this.applyExpression(expression, currentName, nestingLevel), timeShiftEnv.currentFilter);
                const previous = this.filterMainRefs(this.applyExpression(expression, previousName, nestingLevel), timeShiftEnv.previousFilter);
                const delta = new plywood_1.ApplyExpression({
                    name: this.plywoodKey(SeriesDerivation.DELTA),
                    expression: plywood_1.$(currentName).subtract(plywood_1.$(previousName))
                });
                return current.performAction(previous).performAction(delta);
            }
        }
    }
    filterMainRefs(exp, filter) {
        return exp.substitute(e => {
            if (e instanceof plywood_1.RefExpression && e.name === "main") {
                return plywood_1.$("main").filter(filter);
            }
            return null;
        });
    }
    selectValue(datum, period = SeriesDerivation.CURRENT) {
        const value = datum[this.plywoodKey(period)];
        if (typeof value === "number")
            return value;
        if (value === "NaN")
            return NaN;
        if (value === "Infinity")
            return Infinity;
        if (value === "-Infinity")
            return -Infinity;
        return NaN;
    }
    formatter() {
        return series_format_1.seriesFormatter(this.definition.format, this.measure);
    }
    formatValue(datum, period = SeriesDerivation.CURRENT) {
        const value = this.selectValue(datum, period);
        const formatter = series_format_1.seriesFormatter(this.definition.format, this.measure);
        return formatter(value);
    }
    title(derivation = SeriesDerivation.CURRENT) {
        return `${titleWithDerivation(this.measure, derivation)}`;
    }
}
exports.ConcreteSeries = ConcreteSeries;
function titleWithDerivation({ title }, derivation) {
    switch (derivation) {
        case SeriesDerivation.CURRENT:
            return title;
        case SeriesDerivation.PREVIOUS:
            return `Previous ${title}`;
        case SeriesDerivation.DELTA:
            return `Difference ${title}`;
    }
}
exports.titleWithDerivation = titleWithDerivation;
function getNameWithDerivation(reference, derivation) {
    return `${derivation}${reference}`;
}
exports.getNameWithDerivation = getNameWithDerivation;
//# sourceMappingURL=concrete-series.js.map