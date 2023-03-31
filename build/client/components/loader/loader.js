"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const svg_icon_1 = require("../svg-icon/svg-icon");
require("./loader.scss");
class Loader extends react_1.default.Component {
    render() {
        return react_1.default.createElement("div", { className: "loader" },
            react_1.default.createElement(svg_icon_1.SvgIcon, { svg: require("../../icons/grid-loader.svg") }));
    }
}
exports.Loader = Loader;
//# sourceMappingURL=loader.js.map