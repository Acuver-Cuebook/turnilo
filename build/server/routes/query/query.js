"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const view_definitions_1 = require("../../../common/view-definitions");
const create_essence_1 = require("../../utils/essence/create-essence");
const async_handler_1 = require("../../utils/express/async-handler");
const get_query_decorator_1 = require("../../utils/query-decorator-loader/get-query-decorator");
const handle_request_errors_1 = require("../../utils/request-errors/handle-request-errors");
const parse_data_cube_1 = require("../../utils/request-params/parse-data-cube");
const parse_view_definition_1 = require("../../utils/request-params/parse-view-definition");
const boolean_filter_1 = __importDefault(require("./routes/boolean-filter"));
const number_filter_1 = __importDefault(require("./routes/number-filter"));
const pinboard_1 = __importDefault(require("./routes/pinboard"));
const raw_data_1 = __importDefault(require("./routes/raw-data"));
const string_filter_1 = __importDefault(require("./routes/string-filter"));
const visualization_1 = __importDefault(require("./routes/visualization"));
const converter = view_definitions_1.definitionConverters[view_definitions_1.DEFAULT_VIEW_DEFINITION_VERSION];
function queryRouter(settings) {
    const logger = settings.logger;
    const router = express_1.Router();
    router.use(async_handler_1.asyncHandler(async (req, res, next) => {
        const dataCube = await parse_data_cube_1.parseDataCube(req, settings);
        const viewDefinition = parse_view_definition_1.parseViewDefinition(req);
        const essence = create_essence_1.createEssence(viewDefinition, converter, dataCube, settings.appSettings);
        const decorator = get_query_decorator_1.getQueryDecorator(req, dataCube, settings);
        req.context = {
            logger,
            dataCube,
            essence,
            decorator,
            timekeeper: settings.getTimekeeper()
        };
        next();
    }));
    router.post("/visualization", async_handler_1.asyncHandler(visualization_1.default));
    router.post("/raw-data", async_handler_1.asyncHandler(raw_data_1.default));
    router.post("/boolean-filter", async_handler_1.asyncHandler(boolean_filter_1.default));
    router.post("/string-filter", async_handler_1.asyncHandler(string_filter_1.default));
    router.post("/number-filter", async_handler_1.asyncHandler(number_filter_1.default));
    router.post("/pinboard", async_handler_1.asyncHandler(pinboard_1.default));
    router.use((error, req, res, next) => {
        handle_request_errors_1.handleRequestErrors(error, res, logger);
    });
    return router;
}
exports.queryRouter = queryRouter;
//# sourceMappingURL=query.js.map