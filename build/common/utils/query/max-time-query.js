"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
function maxTimeQueryForCube({ timeAttribute, executor }) {
    return maxTimeQuery(timeAttribute, executor);
}
exports.maxTimeQueryForCube = maxTimeQueryForCube;
function maxTimeQuery(timeAttribute, executor) {
    if (!executor) {
        return Promise.reject(new Error("dataCube not ready"));
    }
    const ex = plywood_1.ply().apply("maxTime", plywood_1.$("main").max(timeAttribute));
    return executor(ex).then((dataset) => {
        const maxTimeDate = dataset.data[0]["maxTime"];
        if (isNaN(maxTimeDate))
            return null;
        return maxTimeDate;
    });
}
exports.maxTimeQuery = maxTimeQuery;
//# sourceMappingURL=max-time-query.js.map