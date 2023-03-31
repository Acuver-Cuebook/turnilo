"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../../common/utils/object/object");
const measure_1 = require("./measure");
function deserialize({ tree, byName }) {
    return {
        tree,
        byName: object_1.mapValues(byName, measure_1.deserialize)
    };
}
exports.deserialize = deserialize;
//# sourceMappingURL=measures.js.map