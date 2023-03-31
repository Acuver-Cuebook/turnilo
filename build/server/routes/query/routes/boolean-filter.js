"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const execute_query_1 = require("../../../utils/query/execute-query");
const parse_dimension_1 = require("../../../utils/request-params/parse-dimension");
function getQuery(essence, dimension, timekeeper) {
    const { dataCube } = essence;
    const filterExpression = essence
        .getEffectiveFilter(timekeeper, { unfilterDimension: dimension })
        .toExpression(dataCube);
    return plywood_1.$("main")
        .filter(filterExpression)
        .split(dimension.expression, dimension.name);
}
async function booleanFilterRoute(req, res) {
    const { dataCube, essence, decorator, timekeeper } = req.context;
    const dimension = parse_dimension_1.parseDimension(req, dataCube);
    const query = getQuery(essence, dimension, timekeeper);
    const result = await execute_query_1.executeQuery(dataCube, query, essence.timezone, decorator);
    res.json({ result });
}
exports.default = booleanFilterRoute;
//# sourceMappingURL=boolean-filter.js.map