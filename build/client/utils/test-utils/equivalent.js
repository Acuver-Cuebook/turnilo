"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(chai) {
    chai.Assertion.addMethod("equivalent", function (other) {
        this.assert(this._obj.equals(other), "expected objects to be equivalent", "expected objects to not be equivalent", other, this._obj, true);
    });
}
exports.default = default_1;
//# sourceMappingURL=equivalent.js.map