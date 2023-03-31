"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_query_1 = __importDefault(require("../../../../client/visualizations/grid/make-query"));
const visualization_query_1 = __importDefault(require("../../../../common/utils/query/visualization-query"));
const execute_query_1 = require("../../../utils/query/execute-query");
const log_query_1 = require("../../../utils/query/log-query");
function getQuery(essence, timekeeper) {
    return essence.visualization.name === "grid" ? make_query_1.default(essence, timekeeper) : visualization_query_1.default(essence, timekeeper);
}
async function visualizationRoute({ context }, res) {
    const { dataCube, essence, decorator, timekeeper, logger } = context;
    const query = getQuery(essence, timekeeper);
    const queryTimeStart = Date.now();
    const result = await execute_query_1.executeQuery(dataCube, query, essence.timezone, decorator);
    log_query_1.logQueryInfo(essence, timekeeper, logger.setLoggerId("turnilo-visualization-query"), Date.now() - queryTimeStart);
    res.json({ result });
}
exports.default = visualizationRoute;
//# sourceMappingURL=visualization.js.map