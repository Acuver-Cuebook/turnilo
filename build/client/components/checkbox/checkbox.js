"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dom_1 = require("../../utils/dom/dom");
const svg_icon_1 = require("../svg-icon/svg-icon");
require("./checkbox.scss");
class Checkbox extends react_1.default.Component {
    renderIcon() {
        const { selected, type } = this.props;
        if (!selected)
            return null;
        if (type === "check") {
            return react_1.default.createElement(svg_icon_1.SvgIcon, { svg: require("../../icons/check.svg") });
        }
        else if (type === "cross") {
            return react_1.default.createElement(svg_icon_1.SvgIcon, { svg: require("../../icons/x.svg") });
        }
        return null;
    }
    render() {
        const { onClick, type, color, selected, label, className } = this.props;
        let style = null;
        if (color) {
            style = { background: color };
        }
        return react_1.default.createElement("div", { className: dom_1.classNames("checkbox", type, className, { selected, color }), onClick: onClick },
            react_1.default.createElement("div", { className: "checkbox-body", style: style }),
            this.renderIcon(),
            label ? react_1.default.createElement("div", { className: "label" }, label) : null);
    }
}
exports.Checkbox = Checkbox;
Checkbox.defaultProps = {
    type: "check"
};
//# sourceMappingURL=checkbox.js.map