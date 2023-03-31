"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const dom_1 = require("../../utils/dom/dom");
require("./body-portal.scss");
const normalize_styles_1 = __importDefault(require("./normalize-styles"));
class BodyPortal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAttached: false
        };
        this.target = null;
        this.target = document.createElement("div");
        this.target.className = dom_1.classNames("body-portal", { "full-size": props.fullSize });
    }
    componentDidMount() {
        document.body.appendChild(this.target);
        this.setState({ isAttached: true });
        const { onMount, isAboveAll } = this.props;
        if (onMount)
            onMount();
        if (isAboveAll) {
            if (BodyPortal.aboveAll)
                throw new Error("There can be only one");
            BodyPortal.aboveAll = this;
        }
    }
    componentWillUnmount() {
        document.body.removeChild(this.target);
        if (BodyPortal.aboveAll === this)
            BodyPortal.aboveAll = undefined;
    }
    render() {
        const { isAttached } = this.state;
        Object.assign(this.target.style, normalize_styles_1.default(this.props));
        return ReactDOM.createPortal(isAttached && this.props.children, this.target);
    }
}
exports.BodyPortal = BodyPortal;
BodyPortal.defaultProps = {
    disablePointerEvents: false,
    isAboveAll: false
};
//# sourceMappingURL=body-portal.js.map