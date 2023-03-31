"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dom_1 = require("../../utils/dom/dom");
require("./shpitz.scss");
class Shpitz extends react_1.default.Component {
    render() {
        const { direction, style } = this.props;
        return react_1.default.createElement("div", { className: dom_1.classNames("shpitz", direction), style: style },
            react_1.default.createElement("div", { className: "rectangle" }));
    }
}
exports.Shpitz = Shpitz;
//# sourceMappingURL=shpitz.js.map