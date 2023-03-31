"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const raw_data_modal_1 = require("../../../../common/models/raw-data-modal/raw-data-modal");
const execute_query_1 = require("../../../utils/query/execute-query");
function getQuery(essence, timekeeper) {
    const { dataCube } = essence;
    const $main = plywood_1.$("main");
    const filterExpression = essence
        .getEffectiveFilter(timekeeper)
        .toExpression(dataCube);
    return $main.filter(filterExpression).limit(raw_data_modal_1.LIMIT);
}
async function rawDataRoute({ context }, res) {
    const { dataCube, essence, decorator, timekeeper } = context;
    const query = getQuery(essence, timekeeper);
    const result = await execute_query_1.executeQuery(dataCube, query, essence.timezone, decorator);
    res.json({ result });
}
exports.default = rawDataRoute;
//# sourceMappingURL=raw-data.js.map