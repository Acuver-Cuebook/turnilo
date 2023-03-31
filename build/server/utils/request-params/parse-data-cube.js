"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryable_data_cube_1 = require("../../../common/models/data-cube/queryable-data-cube");
const sources_1 = require("../../../common/models/sources/sources");
const general_1 = require("../../../common/utils/general/general");
const datacube_guard_1 = require("../datacube-guard/datacube-guard");
const request_errors_1 = require("../request-errors/request-errors");
const RESTRICTED_PATHS = ["/plywood", "/query"];
function verifyAccess(req, dataCube) {
    const path = req.path;
    const isRestrictedPath = RESTRICTED_PATHS.some(prefix => path.startsWith(prefix));
    if (!isRestrictedPath)
        return true;
    return datacube_guard_1.checkAccess(dataCube, req.headers);
}
async function parseDataCube(req, settings) {
    const dataCubeName = req.body.dataCube || req.body.dataCubeName || req.body.dataSource;
    if (general_1.isNil(dataCubeName)) {
        throw new request_errors_1.InvalidRequestError("Parameter dataCube is required");
    }
    if (typeof dataCubeName !== "string") {
        throw new request_errors_1.InvalidRequestError(`Expected dataCube to be a string, got: ${typeof dataCubeName}`);
    }
    let sources;
    try {
        sources = await settings.getSources();
    }
    catch (e) {
        throw new request_errors_1.InvalidRequestError("Couldn't load settings");
    }
    const dataCube = sources_1.getDataCube(sources, dataCubeName);
    if (!dataCube) {
        throw new request_errors_1.InvalidRequestError(`Unknown Data Cube: ${dataCube.name}`);
    }
    if (!queryable_data_cube_1.isQueryable(dataCube)) {
        throw new request_errors_1.InvalidRequestError(`Data Cube ${dataCube.name} is not queryable`);
    }
    if (!verifyAccess(req, dataCube)) {
        throw new request_errors_1.AccessDeniedError("Access denied");
    }
    return dataCube;
}
exports.parseDataCube = parseDataCube;
//# sourceMappingURL=parse-data-cube.js.map