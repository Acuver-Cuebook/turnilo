"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./svg-icon.scss");
class SvgIcon extends react_1.default.Component {
    render() {
        const { className, style, svg } = this.props;
        let viewBox = null;
        let svgInsides = null;
        if (typeof svg === "string") {
            svgInsides = svg
                .substr(0, svg.length - 6)
                .replace(/^<svg [^>]+>\s*/i, (svgDec) => {
                const vbMatch = svgDec.match(/viewBox="([\d ]+)"/);
                if (vbMatch)
                    viewBox = vbMatch[1];
                return "";
            });
        }
        else {
            console.warn("svg-icon.tsx: missing icon");
            viewBox = "0 0 16 16";
            svgInsides = "<rect width=16 height=16 fill='red'></rect>";
        }
        return react_1.default.createElement("svg", {
            className: "svg-icon " + (className || ""),
            viewBox,
            preserveAspectRatio: "xMidYMid meet",
            style,
            dangerouslySetInnerHTML: { __html: svgInsides }
        });
    }
}
exports.SvgIcon = SvgIcon;
//# sourceMappingURL=svg-icon.js.map