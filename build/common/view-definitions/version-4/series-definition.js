"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const series_list_1 = require("../../models/series-list/series-list");
exports.seriesDefinitionConverter = {
    fromEssenceSeries: (seriesList) => seriesList.series.toArray().map(series => series.toJS()),
    toEssenceSeries: (seriesDefs, measures) => series_list_1.SeriesList.fromJS(seriesDefs, measures)
};
//# sourceMappingURL=series-definition.js.map