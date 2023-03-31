"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const defaultTimeTag = {
    name: "",
    checkInterval: 60000,
    time: null,
    lastTimeChecked: null
};
class TimeTag extends immutable_1.Record(defaultTimeTag) {
    static fromJS({ name, checkInterval, time: timeJS, lastTimeChecked: lastTimeCheckedJS }) {
        const time = timeJS ? new Date(timeJS) : undefined;
        const lastTimeChecked = lastTimeCheckedJS ? new Date(lastTimeCheckedJS) : time;
        return new TimeTag({
            name,
            checkInterval,
            time,
            lastTimeChecked
        });
    }
    constructor(parameters) {
        super(parameters);
    }
    changeTime(time, lastTimeChecked) {
        return this.set("time", time).set("lastTimeChecked", lastTimeChecked);
    }
}
exports.TimeTag = TimeTag;
//# sourceMappingURL=time-tag.js.map