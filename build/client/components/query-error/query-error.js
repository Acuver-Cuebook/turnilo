"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const constants_1 = require("../../config/constants");
const oauth_1 = require("../../oauth/oauth");
const message_1 = require("../message/message");
exports.QueryError = ({ error }) => {
    if (oauth_1.isOauthError(error)) {
        throw error;
    }
    return react_1.default.createElement(message_1.Message, { level: "error", content: error.message, title: constants_1.STRINGS.queryError });
};
//# sourceMappingURL=query-error.js.map