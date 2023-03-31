"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const general_1 = require("../../common/utils/general/general");
function parseInteger(value) {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new commander_1.InvalidArgumentError("Must be an integer");
    }
    return parsed;
}
exports.parseInteger = parseInteger;
function parseCredentials(username, password, type) {
    if (general_1.isNil(password) && general_1.isNil(username))
        return undefined;
    if (general_1.isNil(username)) {
        throw new commander_1.InvalidArgumentError("Expected username for password");
    }
    if (general_1.isNil(password)) {
        throw new commander_1.InvalidArgumentError("Expected password for username");
    }
    return {
        type,
        username,
        password
    };
}
exports.parseCredentials = parseCredentials;
//# sourceMappingURL=utils.js.map