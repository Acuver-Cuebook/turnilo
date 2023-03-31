"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get("/", (req, res) => {
    res.sendStatus(200);
});
exports.livenessRouter = router;
//# sourceMappingURL=liveness.js.map