"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const defaultRetryOptions = {
    delay: 5000,
    maxAttempts: 5
};
class RetryOptions extends immutable_1.Record(defaultRetryOptions) {
    static fromJS(options) {
        return new RetryOptions(options);
    }
}
exports.RetryOptions = RetryOptions;
//# sourceMappingURL=retry-options.js.map