"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const totals_1 = require("../../visualization-manifests/totals/totals");
const filter_definition_fixtures_1 = require("./filter-definition.fixtures");
exports.total = {
    filters: [filter_definition_fixtures_1.flooredTimeFilterDefinition("time", -1, "P1D")],
    splits: [],
    series: [{ reference: "count" }, { reference: "added" }],
    pinnedDimensions: ["string_a"],
    timezone: chronoshift_1.Timezone.UTC.toString(),
    visualization: totals_1.TOTALS_MANIFEST.name
};
//# sourceMappingURL=view-definition-4.fixture.js.map