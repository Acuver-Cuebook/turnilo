"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functional_1 = require("../utils/functional/functional");
const general_1 = require("../utils/general/general");
const time_1 = require("../utils/time/time");
function errorToMessage(error) {
    if (general_1.isNil(error.stack)) {
        return error.message;
    }
    return `${error.message}\n${error.stack}`;
}
exports.errorToMessage = errorToMessage;
class JSONLogger {
    constructor(logger = "turnilo") {
        this.logger = logger;
    }
    logMessage(level, message, extra = {}) {
        console.log(JSON.stringify({
            message,
            level,
            "@timestamp": time_1.isoNow(),
            "logger": this.logger,
            ...extra
        }));
    }
    log(message, extra = {}) {
        this.logMessage("INFO", message, extra);
    }
    error(message, extra = {}) {
        this.logMessage("ERROR", message, extra);
    }
    warn(message, extra = {}) {
        this.logMessage("WARN", message, extra);
    }
    setLoggerId(loggerId) {
        return new JSONLogger(loggerId);
    }
}
class ConsoleLogger {
    constructor(prefix = "") {
        this.prefix = prefix;
    }
    error(message) {
        console.error(this.prefix, message);
    }
    warn(message) {
        console.warn(this.prefix, message);
    }
    log(message) {
        console.log(this.prefix, message);
    }
    setLoggerId(loggerId) {
        return new ConsoleLogger(loggerId);
    }
}
class AlwaysStdErrLogger {
    setLoggerId() {
        return this;
    }
    error(message) {
        console.error(message);
    }
    log(message) {
        console.error(message);
    }
    warn(message) {
        console.error(message);
    }
}
exports.NOOP_LOGGER = {
    error: functional_1.noop,
    warn: functional_1.noop,
    log: functional_1.noop,
    setLoggerId: () => exports.NOOP_LOGGER
};
const LOGGERS = {
    noop: exports.NOOP_LOGGER,
    json: new JSONLogger(),
    plain: new ConsoleLogger(),
    error: new AlwaysStdErrLogger()
};
function getLogger(format) {
    return LOGGERS[format];
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map