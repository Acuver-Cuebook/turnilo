"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_query_decorator_1 = require("../../utils/query-decorator-loader/get-query-decorator");
const execute_query_1 = require("../../utils/query/execute-query");
const handle_request_errors_1 = require("../../utils/request-errors/handle-request-errors");
const parse_data_cube_1 = require("../../utils/request-params/parse-data-cube");
const parse_expression_1 = require("../../utils/request-params/parse-expression");
const parse_timezone_1 = require("../../utils/request-params/parse-timezone");
function plywoodRouter(settingsManager) {
    const logger = settingsManager.logger;
    const router = express_1.Router();
    router.post("/", async (req, res) => {
        try {
            const dataCube = await parse_data_cube_1.parseDataCube(req, settingsManager);
            const timezone = parse_timezone_1.parseTimezone(req);
            const expression = parse_expression_1.parseExpression(req);
            const queryDecorator = get_query_decorator_1.getQueryDecorator(req, dataCube, settingsManager);
            const result = await execute_query_1.executeQuery(dataCube, expression, timezone, queryDecorator);
            res.json({ result });
        }
        catch (error) {
            handle_request_errors_1.handleRequestErrors(error, res, logger);
        }
    });
    return router;
}
exports.plywoodRouter = plywoodRouter;
//# sourceMappingURL=plywood.js.map