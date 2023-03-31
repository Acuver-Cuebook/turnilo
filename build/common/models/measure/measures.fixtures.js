"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../../utils/object/object");
const measure_fixtures_1 = require("./measure.fixtures");
class MeasuresFixtures {
    static fromMeasures(measures) {
        return {
            tree: measures.map(m => m.name),
            byName: object_1.fromEntries(measures.map(m => [m.name, m]))
        };
    }
    static noTitleJS() {
        return {
            name: "dummyName",
            measures: [
                measure_fixtures_1.MeasureFixtures.wikiCountJS()
            ]
        };
    }
    static withTitleInferredJS() {
        return {
            name: "dummyName",
            title: "Dummy Name",
            measures: [
                measure_fixtures_1.MeasureFixtures.wikiCountJS()
            ]
        };
    }
    static noNameJS() {
        return {
            measures: [measure_fixtures_1.MeasureFixtures.wikiCountJS()]
        };
    }
    static emptyMeasuresJS() {
        return {
            name: "dummyName",
            measures: []
        };
    }
    static wikiNames() {
        return ["count", "added", "avg_added", "delta", "avg_delta"];
    }
    static wiki() {
        return {
            tree: [
                "count",
                {
                    name: "other",
                    title: "Other",
                    measures: [
                        {
                            name: "added_group",
                            title: "Added Group",
                            measures: ["added", "avg_added"]
                        },
                        {
                            name: "delta_group",
                            title: "Delta Group",
                            measures: ["delta", "avg_delta"]
                        }
                    ]
                }
            ],
            byName: {
                count: measure_fixtures_1.MeasureFixtures.count(),
                added: measure_fixtures_1.MeasureFixtures.added(),
                avg_added: measure_fixtures_1.MeasureFixtures.avgAdded(),
                delta: measure_fixtures_1.MeasureFixtures.delta(),
                avg_delta: measure_fixtures_1.MeasureFixtures.avgDelta()
            }
        };
    }
    static twitter() {
        return MeasuresFixtures.fromMeasures([
            measure_fixtures_1.MeasureFixtures.count()
        ]);
    }
}
exports.MeasuresFixtures = MeasuresFixtures;
//# sourceMappingURL=measures.fixtures.js.map