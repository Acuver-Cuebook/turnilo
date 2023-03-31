"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const general_1 = require("../../../common/utils/general/general");
class RequestDecorator {
    constructor(path, options = {}) {
        this.path = path;
        this.options = options;
    }
    static fromJS({ path, options }) {
        if (general_1.isNil(path))
            throw new Error("RequestDecorator must have a path");
        return new RequestDecorator(path, options);
    }
    equals(other) {
        return other instanceof RequestDecorator
            && this.path === other.path
            && plywood_1.dictEqual(this.options, other.options);
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
    valueOf() {
        return {
            options: this.options,
            path: this.path
        };
    }
}
exports.RequestDecorator = RequestDecorator;
//# sourceMappingURL=request-decorator.js.map