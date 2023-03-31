"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_hash_converter_1 = require("../../../common/utils/url-hash-converter/url-hash-converter");
const create_essence_1 = require("../../utils/essence/create-essence");
const handle_request_errors_1 = require("../../utils/request-errors/handle-request-errors");
const parse_data_cube_1 = require("../../utils/request-params/parse-data-cube");
const parse_view_definition_1 = require("../../utils/request-params/parse-view-definition");
const parse_view_definition_converter_1 = require("../../utils/request-params/parse-view-definition-converter");
function mkurlRouter(settings) {
    const router = express_1.Router();
    router.post("/", async (req, res) => {
        try {
            const dataCube = await parse_data_cube_1.parseDataCube(req, settings);
            const viewDefinition = parse_view_definition_1.parseViewDefinition(req);
            const converter = parse_view_definition_converter_1.parseViewDefinitionConverter(req);
            const essence = create_essence_1.createEssence(viewDefinition, converter, dataCube, settings.appSettings);
            const hash = `#${dataCube.name}/${url_hash_converter_1.urlHashConverter.toHash(essence)}`;
            res.json({ hash });
        }
        catch (error) {
            handle_request_errors_1.handleRequestErrors(error, res, settings.logger);
        }
    });
    return router;
}
exports.mkurlRouter = mkurlRouter;
//# sourceMappingURL=mkurl.js.map