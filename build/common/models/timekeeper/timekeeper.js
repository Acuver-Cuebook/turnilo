"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const immutable_class_1 = require("immutable-class");
const object_1 = require("../../utils/object/object");
const time_1 = require("../../utils/time/time");
const time_tag_1 = require("../time-tag/time-tag");
class Timekeeper {
    constructor({ timeTags, nowOverride = null }) {
        this.nowOverride = null;
        this.timeTags = timeTags;
        this.nowOverride = nowOverride;
    }
    static isTimekeeper(candidate) {
        return candidate instanceof Timekeeper;
    }
    static globalNow() {
        return new Date();
    }
    static fromJS({ timeTags, nowOverride = null }) {
        const tags = object_1.mapValues(timeTags, (tag) => time_tag_1.TimeTag.fromJS(tag));
        return new Timekeeper({
            timeTags: immutable_1.Map(tags),
            nowOverride: nowOverride && new Date(nowOverride)
        });
    }
    now() {
        return this.nowOverride || Timekeeper.globalNow();
    }
    getTime(name) {
        const timeTag = this.timeTags.get(name);
        if (!timeTag || !timeTag.time)
            return this.now();
        return timeTag.time;
    }
    changeTimeTags(timeTags) {
        return new Timekeeper({
            ...this.valueOf(),
            timeTags
        });
    }
    updateTime(name, time) {
        const tag = this.timeTags.get(name);
        if (!tag)
            return this;
        const timeTags = this.timeTags.set(name, tag.changeTime(time, this.now()));
        return this.changeTimeTags(timeTags);
    }
    addTimeTagFor(name, checkInterval) {
        const timeTags = this.timeTags.set(name, new time_tag_1.TimeTag({ name, checkInterval }));
        return this.changeTimeTags(timeTags);
    }
    removeTimeTagFor(name) {
        const timeTags = this.timeTags.remove(name);
        return this.changeTimeTags(timeTags);
    }
    equals(other) {
        return Timekeeper.isTimekeeper(other)
            && time_1.datesEqual(this.nowOverride, other.nowOverride)
            && immutable_class_1.immutableLookupsEqual(this.timeTags.toObject(), other.timeTags.toObject());
    }
    toJS() {
        const tags = this.timeTags.toObject();
        return {
            nowOverride: this.nowOverride,
            timeTags: object_1.mapValues(tags, tag => tag.toJS())
        };
    }
    toJSON() {
        return this.toJS();
    }
    toString() {
        return `[Timekeeper: ${this.timeTags.keySeq().join(", ")}]`;
    }
    valueOf() {
        return {
            timeTags: this.timeTags,
            nowOverride: this.nowOverride
        };
    }
}
exports.Timekeeper = Timekeeper;
Timekeeper.EMPTY = new Timekeeper({ timeTags: immutable_1.Map() });
//# sourceMappingURL=timekeeper.js.map