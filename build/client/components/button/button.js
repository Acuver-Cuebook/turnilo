"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dom_1 = require("../../utils/dom/dom");
const svg_icon_1 = require("../svg-icon/svg-icon");
require("./button.scss");
class Button extends react_1.default.Component {
    render() {
        const { title, type, className, svg, active, disabled, onClick } = this.props;
        let icon = null;
        if (svg) {
            icon = react_1.default.createElement(svg_icon_1.SvgIcon, { svg: svg });
        }
        return react_1.default.createElement("button", { className: dom_1.classNames("button", type, className, { icon, active }), onClick: onClick, disabled: disabled },
            icon,
            title);
    }
}
exports.Button = Button;
//# sourceMappingURL=button.js.map