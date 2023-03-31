"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../../common/utils/object/object");
const dimension_1 = require("./dimension");
function deserialize({ tree, byName }) {
    return {
        tree,
        byName: object_1.mapValues(byName, dimension_1.deserialize)
    };
}
exports.deserialize = deserialize;
//# sourceMappingURL=dimensions.js.map