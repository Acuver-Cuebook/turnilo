"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../../../common/logger/logger");
const sources_1 = require("../../../common/models/sources/sources");
const datacube_guard_1 = require("../../utils/datacube-guard/datacube-guard");
function sourcesRouter(settings) {
    const logger = settings.logger.setLoggerId("Sources");
    const router = express_1.Router();
    router.get("/", async (req, res) => {
        try {
            const { clusters, dataCubes } = await settings.getSources();
            res.json(sources_1.serialize({
                clusters,
                dataCubes: dataCubes.filter(dataCube => datacube_guard_1.checkAccess(dataCube, req.headers))
            }));
        }
        catch (error) {
            logger.error(logger_1.errorToMessage(error));
            res.status(500).send({
                error: "Can't fetch settings",
                message: error.message
            });
        }
    });
    return router;
}
exports.sourcesRouter = sourcesRouter;
//# sourceMappingURL=sources.js.map