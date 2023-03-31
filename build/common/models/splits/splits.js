"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const dimension_1 = require("../dimension/dimension");
const dimensions_1 = require("../dimension/dimensions");
const filter_clause_1 = require("../filter-clause/filter-clause");
const granularity_1 = require("../granularity/granularity");
const sort_1 = require("../sort/sort");
const split_1 = require("../split/split");
const timekeeper_1 = require("../timekeeper/timekeeper");
const defaultSplits = { splits: immutable_1.List([]) };
class Splits extends immutable_1.Record(defaultSplits) {
    static fromSplit(split) {
        return new Splits({ splits: immutable_1.List([split]) });
    }
    static fromSplits(splits) {
        return new Splits({ splits: immutable_1.List(splits) });
    }
    static fromDimensions(dimensions) {
        const splits = immutable_1.List(dimensions.map(dimension => split_1.Split.fromDimension(dimension)));
        return new Splits({ splits });
    }
    toString() {
        return this.splits.map(split => split.toString()).join(",");
    }
    replaceByIndex(index, replace) {
        const { splits } = this;
        if (splits.count() === index) {
            return this.insertByIndex(index, replace);
        }
        return this.updateSplits(splits => {
            const newSplitIndex = splits.findIndex(split => split.equals(replace));
            if (newSplitIndex === -1)
                return splits.set(index, replace);
            const oldSplit = splits.get(index);
            return splits
                .set(index, replace)
                .set(newSplitIndex, oldSplit);
        });
    }
    insertByIndex(index, insert) {
        return this.updateSplits(splits => splits
            .insert(index, insert)
            .filterNot((split, idx) => split.equals(insert) && idx !== index));
    }
    addSplit(split) {
        const { splits } = this;
        return this.insertByIndex(splits.count(), split);
    }
    removeSplit(split) {
        return this.updateSplits(splits => splits.filter(s => s.reference !== split.reference));
    }
    changeSort(sort) {
        return this.updateSplits(splits => splits.map(s => s.changeSort(sort)));
    }
    setSortToDimension() {
        return this.updateSplits(splits => splits.map(split => split.changeSort(new sort_1.DimensionSort({ reference: split.reference }))));
    }
    length() {
        return this.splits.count();
    }
    getSplit(index) {
        return this.splits.get(index);
    }
    findSplitForDimension({ name }) {
        return this.splits.find(s => s.reference === name);
    }
    hasSplitOn(dimension) {
        return Boolean(this.findSplitForDimension(dimension));
    }
    replace(search, replace) {
        return this.updateSplits(splits => splits.map(s => s.equals(search) ? replace : s));
    }
    removeBucketingFrom(references) {
        return this.updateSplits(splits => splits.map(split => {
            if (!split.bucket || !references.has(split.reference))
                return split;
            return split.changeBucket(null);
        }));
    }
    updateWithFilter(filter, dimensions) {
        const specificFilter = filter.getSpecificFilter(timekeeper_1.Timekeeper.globalNow(), timekeeper_1.Timekeeper.globalNow(), chronoshift_1.Timezone.UTC);
        return this.updateSplits(splits => splits.map(split => {
            const { bucket, reference } = split;
            if (bucket)
                return split;
            const splitDimension = dimensions_1.findDimensionByName(dimensions, reference);
            const splitKind = splitDimension.kind;
            if (!splitDimension || !(splitKind === "time" || splitKind === "number") || !dimension_1.canBucketByDefault(splitDimension)) {
                return split;
            }
            if (splitKind === "time") {
                if (splitDimension.kind !== "time") {
                    throw new Error(`Expected Time Dimension, god ${splitDimension.kind}`);
                }
                const clause = specificFilter.clauses.find(clause => clause instanceof filter_clause_1.FixedTimeFilterClause);
                return split.changeBucket(clause
                    ? granularity_1.getBestBucketUnitForRange(clause.values.first(), false, splitDimension.bucketedBy, splitDimension.granularities)
                    : granularity_1.getDefaultGranularityForKind("time", splitDimension.bucketedBy, splitDimension.granularities));
            }
            else if (splitKind === "number") {
                if (splitDimension.kind !== "number") {
                    throw new Error(`Expected Number Dimension, god ${splitDimension.kind}`);
                }
                const clause = specificFilter.clauses.find(clause => clause instanceof filter_clause_1.NumberFilterClause);
                return split.changeBucket(clause
                    ? granularity_1.getBestBucketUnitForRange(clause.values.first(), false, splitDimension.bucketedBy, splitDimension.granularities)
                    : granularity_1.getDefaultGranularityForKind("number", splitDimension.bucketedBy, splitDimension.granularities));
            }
            throw new Error("unknown extent type");
        }));
    }
    constrainToDimensionsAndSeries(dimensions, series) {
        function validSplit(split) {
            if (!dimensions_1.findDimensionByName(dimensions, split.reference))
                return false;
            if (sort_1.isSortEmpty(split.sort))
                return true;
            const sortRef = split.sort.reference;
            const sortedDimensionExists = dimensions_1.findDimensionByName(dimensions, sortRef) !== null;
            return sortedDimensionExists || series.hasSeriesWithKey(sortRef);
        }
        return this.updateSplits(splits => splits.filter(validSplit));
    }
    changeSortIfOnMeasure(fromMeasure, toMeasure) {
        return this.updateSplits(splits => splits.map(split => {
            const { sort } = split;
            if (!sort || sort.reference !== fromMeasure)
                return split;
            return split.setIn(["sort", "reference"], toMeasure);
        }));
    }
    getCommonSort() {
        const { splits } = this;
        if (splits.count() === 0)
            return null;
        const commonSort = splits.get(0).sort;
        return splits.every(({ sort }) => sort.equals(commonSort)) ? commonSort : null;
    }
    updateSplits(updater) {
        return this.update("splits", updater);
    }
    slice(from, to) {
        return this.updateSplits(splits => splits.slice(from, to));
    }
}
exports.Splits = Splits;
exports.EMPTY_SPLITS = new Splits({ splits: immutable_1.List([]) });
//# sourceMappingURL=splits.js.map