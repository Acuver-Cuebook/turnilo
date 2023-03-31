"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customization_1 = require("../../../common/models/customization/customization");
const views_1 = require("../../views");
function turniloRouter(settings, version) {
    const appSettings = settings.appSettings;
    const router = express_1.Router();
    router.get("/", async (req, res) => {
        try {
            res.send(views_1.mainLayout({
                version,
                title: customization_1.getTitle(appSettings.customization, version),
                appSettings,
                timekeeper: settings.getTimekeeper()
            }));
        }
        catch (e) {
            res.status(400).send({ error: "Couldn't load Turnilo Application" });
        }
    });
    return router;
}
exports.turniloRouter = turniloRouter;
//# sourceMappingURL=turnilo.js.map