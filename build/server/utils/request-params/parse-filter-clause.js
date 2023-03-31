"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_clause_1 = require("../../../common/models/filter-clause/filter-clause");
const general_1 = require("../../../common/utils/general/general");
const filter_definition_1 = require("../../../common/view-definitions/version-4/filter-definition");
const request_errors_1 = require("../request-errors/request-errors");
function readStringClause(clauseJS, dataCube) {
    let clause;
    try {
        clause = filter_definition_1.filterDefinitionConverter.toFilterClause(clauseJS, dataCube);
    }
    catch (error) {
        throw new request_errors_1.InvalidRequestError(error.message);
    }
    if (!filter_clause_1.isStringFilterClause(clause)) {
        throw new request_errors_1.InvalidRequestError(`Expected string filter clause, but got ${clause.type}`);
    }
    return clause;
}
function parseStringFilterClause(req, dataCube) {
    const clauseJS = req.body.clause;
    if (general_1.isNil(clauseJS)) {
        throw new request_errors_1.InvalidRequestError("Parameter clause is required");
    }
    return readStringClause(clauseJS, dataCube);
}
exports.parseStringFilterClause = parseStringFilterClause;
function parseOptionalStringFilterClause(req, dataCube) {
    const clauseJS = req.body.clause;
    if (general_1.isNil(clauseJS)) {
        return null;
    }
    return readStringClause(clauseJS, dataCube);
}
exports.parseOptionalStringFilterClause = parseOptionalStringFilterClause;
//# sourceMappingURL=parse-filter-clause.js.map