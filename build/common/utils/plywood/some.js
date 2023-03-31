"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function some(ex, predicate) {
    let found = false;
    ex.forEach(subEx => {
        if (predicate(subEx)) {
            found = true;
        }
    });
    return found;
}
exports.default = some;
//# sourceMappingURL=some.js.map