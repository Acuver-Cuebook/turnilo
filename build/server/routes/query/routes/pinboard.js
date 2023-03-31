"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const dimensions_1 = require("../../../../common/models/dimension/dimensions");
const time_shift_env_1 = require("../../../../common/models/time-shift/time-shift-env");
const query_1 = require("../../../../common/utils/canonical-length/query");
const time_filter_canonical_length_1 = __importDefault(require("../../../../common/utils/canonical-length/time-filter-canonical-length"));
const general_1 = require("../../../../common/utils/general/general");
const execute_query_1 = require("../../../utils/query/execute-query");
const parse_filter_clause_1 = require("../../../utils/request-params/parse-filter-clause");
const parse_split_1 = require("../../../utils/request-params/parse-split");
function getQuery(essence, clause, split, timekeeper) {
    const { dataCube } = essence;
    const dimension = dimensions_1.findDimensionByName(dataCube.dimensions, split.reference);
    const sortSeries = essence.findConcreteSeries(split.sort.reference);
    const canonicalLength = time_filter_canonical_length_1.default(essence, timekeeper);
    const filter = essence
        .changeFilter(general_1.isNil(clause) ? essence.filter.removeClause(split.reference) : essence.filter.setClause(clause))
        .getEffectiveFilter(timekeeper)
        .toExpression(dataCube);
    return plywood_1.$("main")
        .filter(filter)
        .split(dimension.expression, dimension.name)
        .apply(query_1.CANONICAL_LENGTH_ID, canonicalLength)
        .performAction(sortSeries.plywoodExpression(0, { type: time_shift_env_1.TimeShiftEnvType.CURRENT }))
        .performAction(split.sort.toExpression())
        .limit(split.limit);
}
async function pinboardRoute(req, res) {
    const { dataCube, essence, decorator, timekeeper } = req.context;
    const clause = parse_filter_clause_1.parseOptionalStringFilterClause(req, dataCube);
    const split = parse_split_1.parseSplit(req, dataCube);
    const query = getQuery(essence, clause, split, timekeeper);
    const result = await execute_query_1.executeQuery(dataCube, query, essence.timezone, decorator);
    res.json({ result });
}
exports.default = pinboardRoute;
//# sourceMappingURL=pinboard.js.map