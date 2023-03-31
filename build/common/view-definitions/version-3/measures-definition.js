"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const measures_1 = require("../../models/measure/measures");
const series_list_1 = require("../../models/series-list/series-list");
exports.seriesDefinitionConverter = {
    toEssenceSeries: ({ isMulti, multi, single }, measures) => {
        const names = isMulti ? multi : [single];
        return series_list_1.SeriesList.fromMeasures(names.map(name => measures_1.findMeasureByName(measures, name)));
    }
};
//# sourceMappingURL=measures-definition.js.map