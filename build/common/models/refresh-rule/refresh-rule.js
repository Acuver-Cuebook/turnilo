"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let check;
class RefreshRule {
    constructor(parameters) {
        const rule = parameters.rule;
        if (rule !== RefreshRule.FIXED && rule !== RefreshRule.QUERY && rule !== RefreshRule.REALTIME) {
            throw new Error(`rule must be on of: ${RefreshRule.FIXED}, ${RefreshRule.QUERY}, or ${RefreshRule.REALTIME}`);
        }
        this.rule = rule;
        this.time = parameters.time;
    }
    static isRefreshRule(candidate) {
        return candidate instanceof RefreshRule;
    }
    static query() {
        return new RefreshRule({
            rule: RefreshRule.QUERY
        });
    }
    static fromJS(parameters) {
        const value = {
            rule: parameters.rule
        };
        if (parameters.time) {
            value.time = new Date(parameters.time);
        }
        return new RefreshRule(value);
    }
    valueOf() {
        const value = {
            rule: this.rule
        };
        if (this.time) {
            value.time = this.time;
        }
        return value;
    }
    toJS() {
        const js = {
            rule: this.rule
        };
        if (this.time) {
            js.time = this.time;
        }
        return js;
    }
    toJSON() {
        return this.toJS();
    }
    toString() {
        return `[RefreshRule: ${this.rule}]`;
    }
    equals(other) {
        return RefreshRule.isRefreshRule(other) &&
            this.rule === other.rule &&
            (!this.time || this.time.valueOf() === other.time.valueOf());
    }
    isFixed() {
        return this.rule === RefreshRule.FIXED;
    }
    isQuery() {
        return this.rule === RefreshRule.QUERY;
    }
    isRealtime() {
        return this.rule === RefreshRule.REALTIME;
    }
}
exports.RefreshRule = RefreshRule;
RefreshRule.FIXED = "fixed";
RefreshRule.QUERY = "query";
RefreshRule.REALTIME = "realtime";
check = RefreshRule;
//# sourceMappingURL=refresh-rule.js.map