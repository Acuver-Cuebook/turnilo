"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request = __importStar(require("request-promise-native"));
const logger_1 = require("../../../common/logger/logger");
function shortenRouter(settings, isTrustedProxy) {
    const logger = settings.logger;
    const router = express_1.Router();
    router.get("/", async (req, res) => {
        const { url } = req.query;
        try {
            const shortener = settings.appSettings.customization.urlShortener;
            const context = {
                clientIp: isTrustedProxy ? req.ip : req.connection.remoteAddress
            };
            const shortUrl = await shortener(request, url, context);
            res.json({ shortUrl });
        }
        catch (error) {
            logger.error(logger_1.errorToMessage(error));
            res.status(500).send({
                error: "could not shorten url",
                message: error.message
            });
        }
    });
    return router;
}
exports.shortenRouter = shortenRouter;
//# sourceMappingURL=shorten.js.map