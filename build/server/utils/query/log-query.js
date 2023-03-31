"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const data_cube_1 = require("../../../common/models/data-cube/data-cube");
const used_measures_1 = require("../../../common/models/series/used-measures");
function start(clause) {
    return clause.values.first().start;
}
function intervalLength(start, end) {
    return end.getTime() - start.getTime();
}
function clauseInterval(clause) {
    const { end, start } = clause.values.first();
    return intervalLength(start, end);
}
function timeVariables(essence, timekeeper) {
    const maxTime = data_cube_1.getMaxTime(essence.dataCube, timekeeper);
    const timeFilter = essence.currentTimeFilter(timekeeper);
    const timeDimension = essence.getTimeDimension();
    const timeSplit = essence.splits.findSplitForDimension(timeDimension);
    const startTime = start(timeFilter);
    const interval = clauseInterval(timeFilter);
    const variables = {
        startTime: startTime.toISOString(),
        startTimeMsAgo: intervalLength(startTime, maxTime),
        interval
    };
    if (timeSplit && timeSplit.bucket instanceof chronoshift_1.Duration) {
        variables.granularity = timeSplit.bucket.toString();
    }
    if (essence.hasComparison()) {
        const previousTimeFilter = essence.previousTimeFilter(timekeeper);
        const shiftedStartTime = start(previousTimeFilter);
        variables.shiftedStartTime = shiftedStartTime.toISOString();
        variables.shiftedStartTimeMsAgo = intervalLength(shiftedStartTime, maxTime);
        variables.timeShift = essence.timeShift.toString();
    }
    return variables;
}
function logQueryInfo(essence, timekeeper, logger, executionTime) {
    const nonTimeFilters = essence.filter.removeClause(essence.getTimeDimension().name);
    logger.log(`Visualization query ${essence.description(timekeeper)}`, {
        executionTime,
        ...timeVariables(essence, timekeeper),
        dataCube: essence.dataCube.name,
        visualization: essence.visualization.name,
        filters: nonTimeFilters.clauses.map(clause => clause.reference).toArray(),
        splits: essence.splits.splits.map(split => split.reference).toArray(),
        measures: essence.series.series.flatMap(used_measures_1.usedMeasures).toSet().toArray()
    });
}
exports.logQueryInfo = logQueryInfo;
//# sourceMappingURL=log-query.js.map