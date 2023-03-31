"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timekeeper_1 = require("./timekeeper");
class TimekeeperFixtures {
    static fixedJS() {
        return {
            timeTags: {},
            nowOverride: new Date("2016-08-08T08:08:08Z")
        };
    }
    static fixed() {
        return timekeeper_1.Timekeeper.fromJS(TimekeeperFixtures.fixedJS());
    }
    static wiki() {
        return timekeeper_1.Timekeeper.fromJS({
            timeTags: {},
            nowOverride: new Date("2015-09-13T00:00:00.000Z")
        });
    }
}
exports.TimekeeperFixtures = TimekeeperFixtures;
//# sourceMappingURL=timekeeper.fixtures.js.map