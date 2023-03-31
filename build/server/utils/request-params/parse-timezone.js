"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const general_1 = require("../../../common/utils/general/general");
const request_errors_1 = require("../request-errors/request-errors");
function parseTimezone(req) {
    const { timezone } = req.body;
    if (general_1.isNil(timezone))
        return null;
    if (typeof timezone !== "string") {
        throw new request_errors_1.InvalidRequestError("Parameter timezone should be a string");
    }
    try {
        return chronoshift_1.Timezone.fromJS(timezone);
    }
    catch (e) {
        throw new request_errors_1.InvalidRequestError(`Bad timezone: ${e.message}`);
    }
}
exports.parseTimezone = parseTimezone;
//# sourceMappingURL=parse-timezone.js.map