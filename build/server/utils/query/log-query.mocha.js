"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const essence_1 = require("../../../common/models/essence/essence");
const essence_fixtures_1 = require("../../../common/models/essence/essence.fixtures");
const series_fixtures_1 = require("../../../common/models/series/series.fixtures");
const split_fixtures_1 = require("../../../common/models/split/split.fixtures");
const time_shift_1 = require("../../../common/models/time-shift/time-shift");
const timekeeper_fixtures_1 = require("../../../common/models/timekeeper/timekeeper.fixtures");
const log_query_1 = require("./log-query");
describe("log-query-info", () => {
    const logger = {};
    beforeEach(() => {
        logger.log = sinon_1.spy();
    });
    const baseEssence = essence_fixtures_1.EssenceFixtures.wikiTotals().addSeries(series_fixtures_1.measureSeries("added"));
    const timekeeper = timekeeper_fixtures_1.TimekeeperFixtures.wiki();
    const executionTime = 42;
    const expectedMessage = "Visualization query wiki_2016-04-29-12-40_2016-04-30-12-40";
    const expectedBasicVariables = {
        executionTime: 42,
        startTime: "2016-04-29T12:40:00.000Z",
        startTimeMsAgo: 86391350,
        interval: 86400000,
        dataCube: "wiki",
        visualization: "totals",
        filters: ["commentLength"],
        splits: [],
        measures: ["added"]
    };
    it("Should log all basic variables", () => {
        log_query_1.logQueryInfo(baseEssence, timekeeper, logger, executionTime);
        chai_1.expect(logger.log.calledWith(expectedMessage, expectedBasicVariables)).to.be.true;
    });
    it("Should log additional time shift variables", () => {
        const essence = baseEssence.set("timeShift", time_shift_1.TimeShift.fromJS("P1D"));
        log_query_1.logQueryInfo(essence, timekeeper, logger, executionTime);
        chai_1.expect(logger.log.calledWith(expectedMessage, {
            ...expectedBasicVariables,
            timeShift: "P1D",
            shiftedStartTime: "2016-04-28T12:40:00.000Z",
            shiftedStartTimeMsAgo: 172791350
        })).to.be.true;
    });
    it("Should log additional time split variables", () => {
        const essence = baseEssence.addSplit(split_fixtures_1.timeSplitCombine("time", "P2D"), essence_1.VisStrategy.FairGame);
        log_query_1.logQueryInfo(essence, timekeeper, logger, executionTime);
        chai_1.expect(logger.log.calledWith(expectedMessage, {
            ...expectedBasicVariables,
            visualization: "line-chart",
            splits: ["time"],
            granularity: "P2D"
        })).to.be.true;
    });
});
//# sourceMappingURL=log-query.mocha.js.map