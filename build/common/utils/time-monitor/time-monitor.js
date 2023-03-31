"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timekeeper_1 = require("../../models/timekeeper/timekeeper");
const max_time_query_1 = require("../query/max-time-query");
class TimeMonitor {
    constructor(logger) {
        this.doingChecks = false;
        this.doCheck = ({ name, time: previousTime }) => {
            const { logger, checks } = this;
            const check = checks.get(name);
            if (!check)
                return Promise.resolve(null);
            return check().then(updatedTime => {
                logger.log(`Got the latest time for '${name}' (${updatedTime.toISOString()})`);
                this.timekeeper = this.timekeeper.updateTime(name, updatedTime);
            }).catch(e => {
                logger.error(`Failed getting time for '${name}', using previous time. Error: ${e.message}`);
                this.timekeeper = this.timekeeper.updateTime(name, previousTime);
            });
        };
        this.isStale = ({ time, lastTimeChecked, checkInterval }) => {
            const { timekeeper } = this;
            const now = timekeeper.now().valueOf();
            return !time || now - lastTimeChecked.valueOf() > checkInterval;
        };
        this.doChecks = () => {
            const { doingChecks, timekeeper } = this;
            if (doingChecks)
                return;
            const timeTags = timekeeper.timeTags;
            this.doingChecks = true;
            const checkTasks = timeTags.filter(this.isStale).map(this.doCheck).values();
            Promise.all(checkTasks).then(() => {
                this.doingChecks = false;
            });
        };
        this.logger = logger.setLoggerId("TimeMonitor");
        this.checks = new Map();
        this.timekeeper = timekeeper_1.Timekeeper.EMPTY;
        setInterval(this.doChecks, 1000);
    }
    removeCheck({ name }) {
        this.checks.delete(name);
        this.timekeeper = this.timekeeper.removeTimeTagFor(name);
        return this;
    }
    addCheck(cube, sourceTimeBoundaryRefreshInterval) {
        const { name } = cube;
        this.checks.set(name, () => max_time_query_1.maxTimeQueryForCube(cube));
        this.timekeeper = this.timekeeper.addTimeTagFor(name, sourceTimeBoundaryRefreshInterval);
        return this;
    }
}
exports.TimeMonitor = TimeMonitor;
//# sourceMappingURL=time-monitor.js.map