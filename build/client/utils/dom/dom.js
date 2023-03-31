"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("d3"));
const general_1 = require("../../../common/utils/general/general");
const DRAG_GHOST_OFFSET_X = -12;
const DRAG_GHOST_OFFSET_Y = -12;
const KEY_CODES = {
    ENTER: 13,
    ESCAPE: 27,
    LEFT: 37,
    RIGHT: 39
};
function isInside(child, parent) {
    let altParent;
    while (child) {
        if (child === parent)
            return true;
        const dataset = child.dataset;
        if (dataset && dataset["parent"] && (altParent = document.getElementById(dataset["parent"]))) {
            child = altParent;
        }
        else {
            child = child.parentElement;
        }
    }
    return false;
}
exports.isInside = isInside;
function findParentWithClass(child, className) {
    while (child) {
        if (child.classList.contains(className))
            return child;
        child = child.parentNode;
    }
    return null;
}
exports.findParentWithClass = findParentWithClass;
function setDragGhost(dataTransfer, text) {
    if (dataTransfer.setDragImage === undefined) {
        return;
    }
    const dragGhost = d3.select(document.body).append("div")
        .attr("class", "drag-ghost")
        .text(text);
    dataTransfer.setDragImage(dragGhost.node(), DRAG_GHOST_OFFSET_X, DRAG_GHOST_OFFSET_Y);
    setTimeout(() => {
        dragGhost.remove();
    }, 1);
}
exports.setDragGhost = setDragGhost;
exports.setDragData = (dataTransfer, format, data) => {
    try {
        dataTransfer.setData(format, data);
    }
    catch (e) {
        dataTransfer.setData("text", data);
    }
};
function enterKey(e) {
    return e.which === KEY_CODES.ENTER;
}
exports.enterKey = enterKey;
function escapeKey(e) {
    return e.which === KEY_CODES.ESCAPE;
}
exports.escapeKey = escapeKey;
function leftKey(e) {
    return e.which === KEY_CODES.LEFT;
}
exports.leftKey = leftKey;
function rightKey(e) {
    return e.which === KEY_CODES.RIGHT;
}
exports.rightKey = rightKey;
let lastID = 0;
function uniqueId(prefix) {
    lastID++;
    return prefix + lastID;
}
exports.uniqueId = uniqueId;
function transformStyle(x, y) {
    let xStr = String(x);
    let yStr = String(y);
    if (xStr !== "0")
        xStr += "px";
    if (yStr !== "0")
        yStr += "px";
    const transform = `translate(${xStr},${yStr})`;
    return {
        transform,
        WebkitTransform: transform,
        MsTransform: transform
    };
}
exports.transformStyle = transformStyle;
function getXFromEvent(e) {
    return e.clientX || e.pageX;
}
exports.getXFromEvent = getXFromEvent;
function getYFromEvent(e) {
    return e.clientY || e.pageY;
}
exports.getYFromEvent = getYFromEvent;
function roundToPx(n) {
    return Math.round(n);
}
exports.roundToPx = roundToPx;
function roundToHalfPx(n) {
    return Math.round(n - 0.5) + 0.5;
}
exports.roundToHalfPx = roundToHalfPx;
function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
exports.clamp = clamp;
function classNames(...args) {
    const classes = [];
    for (const arg of args) {
        if (!arg)
            continue;
        const argType = typeof arg;
        if (argType === "string") {
            classes.push(arg);
        }
        else if (argType === "object") {
            for (const key in arg) {
                if (general_1.hasOwnProperty(arg, key) && arg[key])
                    classes.push(key);
            }
        }
    }
    return classes.join(" ");
}
exports.classNames = classNames;
//# sourceMappingURL=dom.js.map