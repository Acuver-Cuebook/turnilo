"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const dimensions_1 = require("../../../../common/models/dimension/dimensions");
const execute_query_1 = require("../../../utils/query/execute-query");
const parse_filter_clause_1 = require("../../../utils/request-params/parse-filter-clause");
const TOP_N = 100;
function getQuery(essence, clause, timekeeper) {
    const { dataCube } = essence;
    const { reference: dimensionName } = clause;
    const $main = plywood_1.$("main");
    const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, dimensionName);
    const nativeCount = dimensions_1.findDimensionByName(dataCube.dimensions, "count");
    const measureExpression = nativeCount ? nativeCount.expression : $main.count();
    const filter = essence
        .changeFilter(essence.filter.setClause(clause))
        .getEffectiveFilter(timekeeper).toExpression(dataCube);
    return $main
        .filter(filter)
        .split(dimension.expression, dimension.name)
        .apply("MEASURE", measureExpression)
        .sort(plywood_1.$("MEASURE"), plywood_1.SortExpression.DESCENDING)
        .limit(TOP_N);
}
async function stringFilterRoute(req, res) {
    const { dataCube, essence, decorator, timekeeper } = req.context;
    const clause = parse_filter_clause_1.parseStringFilterClause(req, dataCube);
    const query = getQuery(essence, clause, timekeeper);
    const result = await execute_query_1.executeQuery(dataCube, query, essence.timezone, decorator);
    res.json({ result });
}
exports.default = stringFilterRoute;
//# sourceMappingURL=string-filter.js.map