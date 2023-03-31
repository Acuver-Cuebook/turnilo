"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3_1 = require("d3");
exports.DEFAULT_SERIES_COLORS = [
    "#2D95CA",
    "#EFB925",
    "#DA4E99",
    "#4CC873",
    "#745CBD",
    "#EA7136",
    "#E68EE0",
    "#218C35",
    "#B0B510",
    "#904064"
];
exports.DEFAULT_MAIN_COLOR = "#FF5900";
exports.DEFAULT_COLORS = {
    main: exports.DEFAULT_MAIN_COLOR,
    series: exports.DEFAULT_SERIES_COLORS
};
function lightMain(colors) {
    return d3_1.hsl(colors.main).brighter(1.3).toString();
}
exports.lightMain = lightMain;
function alphaMain(colors) {
    const { r, g, b } = d3_1.rgb(colors.main);
    return `rgba(${r}, ${g}, ${b}, ${0.14})`;
}
exports.alphaMain = alphaMain;
function colorSplitLimits(max) {
    const limits = d3_1.range(5, max, 5);
    if (limits[limits.length - 1] < max) {
        return [...limits, max];
    }
    return limits;
}
exports.colorSplitLimits = colorSplitLimits;
//# sourceMappingURL=colors.js.map