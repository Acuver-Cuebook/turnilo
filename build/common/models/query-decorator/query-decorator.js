"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
class QueryDecoratorDefinition {
    constructor(path, options) {
        this.path = path;
        this.options = options;
    }
    static fromJS({ path, options }) {
        return new QueryDecoratorDefinition(path, options);
    }
    equals(other) {
        return other instanceof QueryDecoratorDefinition
            && this.path === other.path
            && plywood_1.dictEqual(this.options, other.options);
    }
    valueOf() {
        return {
            options: this.options,
            path: this.path
        };
    }
    toJS() {
        return {
            options: this.options,
            path: this.path
        };
    }
    toJSON() {
        return this.toJS();
    }
}
exports.QueryDecoratorDefinition = QueryDecoratorDefinition;
//# sourceMappingURL=query-decorator.js.map