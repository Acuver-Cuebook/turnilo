"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
async function executeQuery(dataCube, query, timezone, decorator) {
    const maxQueries = dataCube.maxQueries;
    const expression = decorator(query);
    const data = await dataCube.executor(expression, { maxQueries, timezone });
    return plywood_1.Dataset.isDataset(data) ? data.toJS() : data;
}
exports.executeQuery = executeQuery;
//# sourceMappingURL=execute-query.js.map