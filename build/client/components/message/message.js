"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dom_1 = require("../../utils/dom/dom");
require("./message.scss");
exports.Message = props => {
    const { content, title, level = "notice" } = props;
    return react_1.default.createElement("div", { className: dom_1.classNames("message", level) },
        react_1.default.createElement("div", { className: "whiteout" }),
        react_1.default.createElement("div", { className: "message-container" },
            react_1.default.createElement("div", { className: "message-title" }, title),
            react_1.default.createElement("div", { className: "message-content" }, content)));
};
//# sourceMappingURL=message.js.map