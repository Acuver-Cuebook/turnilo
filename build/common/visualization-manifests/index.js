"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_class_1 = require("immutable-class");
const bar_chart_1 = require("./bar-chart/bar-chart");
const grid_1 = require("./grid/grid");
const heat_map_1 = require("./heat-map/heat-map");
const line_chart_1 = require("./line-chart/line-chart");
const scatterplot_1 = require("./scatterplot/scatterplot");
const table_1 = require("./table/table");
const totals_1 = require("./totals/totals");
exports.MANIFESTS = [
    totals_1.TOTALS_MANIFEST,
    grid_1.GRID_MANIFEST,
    line_chart_1.LINE_CHART_MANIFEST,
    bar_chart_1.BAR_CHART_MANIFEST,
    heat_map_1.HEAT_MAP_MANIFEST,
    table_1.TABLE_MANIFEST,
    scatterplot_1.SCATTERPLOT_MANIFEST
];
function manifestByName(visualizationName) {
    return immutable_class_1.NamedArray.findByName(exports.MANIFESTS, visualizationName);
}
exports.manifestByName = manifestByName;
//# sourceMappingURL=index.js.map