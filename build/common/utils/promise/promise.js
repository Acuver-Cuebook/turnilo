"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function timeout(ms) {
    return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(`Timed out in ${ms}ms.`);
        }, ms);
    });
}
exports.timeout = timeout;
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=promise.js.map