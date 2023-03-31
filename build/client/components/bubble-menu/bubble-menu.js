"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const stage_1 = require("../../../common/models/stage/stage");
const dom_1 = require("../../utils/dom/dom");
const body_portal_1 = require("../body-portal/body-portal");
const shpitz_1 = require("../shpitz/shpitz");
require("./bubble-menu.scss");
exports.OFFSET_H = 10;
exports.OFFSET_V = 0;
exports.SCREEN_OFFSET = 5;
function defaultStage() {
    return new stage_1.Stage({
        x: exports.SCREEN_OFFSET,
        y: exports.SCREEN_OFFSET,
        width: window.innerWidth - exports.SCREEN_OFFSET * 2,
        height: window.innerHeight - exports.SCREEN_OFFSET * 2
    });
}
function alignHorizontalInside(align, { left, width }) {
    switch (align) {
        case "center":
            return left + width / 2;
        case "start":
            return left;
        case "end":
            return left + width;
    }
}
function alignHorizontalOutside(align, x, width) {
    switch (align) {
        case "center":
            return x - width / 2;
        case "start":
            return x;
        case "end":
            return x - width;
    }
}
class BubbleMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            id: null
        };
        this.globalMouseDownListener = (e) => {
            const { onClose, openOn } = this.props;
            const { id } = this.state;
            const myElement = document.getElementById(id);
            if (!myElement)
                return;
            const target = e.target;
            if (dom_1.isInside(target, myElement) || dom_1.isInside(target, openOn))
                return;
            onClose();
        };
        this.globalKeyDownListener = (e) => {
            if (!dom_1.escapeKey(e))
                return;
            const { onClose } = this.props;
            onClose();
        };
    }
    componentDidMount() {
        const { alignOn, openOn, id } = this.props;
        const rect = (alignOn || openOn).getBoundingClientRect();
        this.setState({
            id: id || dom_1.uniqueId("bubble-menu-"),
            ...this.calcBubbleCoordinates(rect)
        });
        window.addEventListener("mousedown", this.globalMouseDownListener);
        window.addEventListener("keydown", this.globalKeyDownListener);
    }
    componentWillUnmount() {
        window.removeEventListener("mousedown", this.globalMouseDownListener);
        window.removeEventListener("keydown", this.globalKeyDownListener);
    }
    calcBubbleCoordinates(rect) {
        const { direction, align } = this.props;
        switch (direction) {
            case "right":
                return {
                    x: rect.left + rect.width - exports.OFFSET_H,
                    y: rect.top + rect.height / 2
                };
            case "down":
                return {
                    x: alignHorizontalInside(align, rect),
                    y: rect.top + rect.height - exports.OFFSET_V
                };
            case "up":
                return {
                    x: alignHorizontalInside(align, rect),
                    y: window.innerHeight - rect.top - exports.OFFSET_V
                };
            default:
                throw new Error(`unknown direction: '${direction}'`);
        }
    }
    calcMenuPosition() {
        const { align, direction, stage, containerStage } = this.props;
        const { x: menuX, y: menuY } = this.state;
        const { height: menuHeight, width: menuWidth } = stage;
        const container = containerStage || defaultStage();
        const containerVerticalExtent = container.y + container.height - menuHeight;
        const containerHorizontalExtent = container.x + container.width - menuWidth;
        switch (direction) {
            case "right":
                const top = menuY - menuHeight / 2;
                const clampedTop = dom_1.clamp(top, container.y, containerVerticalExtent);
                return {
                    top: clampedTop,
                    height: menuHeight,
                    left: menuX,
                    maxWidth: container.width
                };
            case "down": {
                const left = alignHorizontalOutside(align, menuX, menuWidth);
                const clampedLeft = dom_1.clamp(left, container.x, containerHorizontalExtent);
                return {
                    left: clampedLeft,
                    width: menuWidth,
                    top: menuY,
                    maxHeight: container.height
                };
            }
            case "up": {
                const left = alignHorizontalOutside(align, menuX, menuWidth);
                const clampedLeft = dom_1.clamp(left, container.x, containerHorizontalExtent);
                return {
                    left: clampedLeft,
                    width: menuWidth,
                    bottom: menuY,
                    maxHeight: container.height
                };
            }
            default:
                throw new Error(`unknown direction: '${direction}'`);
        }
    }
    calcShpitzPosition(menuStyle) {
        const { x, y } = this.state;
        const { direction } = this.props;
        const { left, top } = menuStyle;
        switch (direction) {
            case "right":
                return {
                    top: y - top,
                    left: 0
                };
            case "down":
                return {
                    left: x - left,
                    top: 0
                };
            case "up":
                return {
                    left: x - left,
                    bottom: 0
                };
            default:
                throw new Error(`unknown direction: '${direction}'`);
        }
    }
    getInsideId() {
        const { inside } = this.props;
        if (!inside)
            return null;
        if (!inside.id)
            throw new Error("inside element must have id");
        return inside.id;
    }
    render() {
        const { className, direction, stage, fixedSize, layout, align, children } = this.props;
        const { id } = this.state;
        const insideId = this.getInsideId();
        const menuCoordinates = this.calcMenuPosition();
        const hasShpitz = align === "center";
        const shpitzCoordinates = hasShpitz && this.calcShpitzPosition(menuCoordinates);
        const { maxHeight, maxWidth, left, top, bottom, height, width } = menuCoordinates;
        const menuSize = fixedSize ? { width: stage.width, height: stage.height } : { maxHeight, maxWidth, height, width };
        const myClass = dom_1.classNames("bubble-menu", direction, className, { mini: layout === "mini" });
        return react_1.default.createElement(body_portal_1.BodyPortal, { left: left, top: top, bottom: bottom },
            react_1.default.createElement("div", { className: myClass, id: id, "data-parent": insideId, style: menuSize },
                children,
                hasShpitz && react_1.default.createElement(shpitz_1.Shpitz, { style: shpitzCoordinates, direction: direction })));
    }
}
exports.BubbleMenu = BubbleMenu;
BubbleMenu.defaultProps = {
    align: "center"
};
//# sourceMappingURL=bubble-menu.js.map