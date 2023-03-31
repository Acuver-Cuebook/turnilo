"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const measures_1 = require("./measures");
class MeasureFixtures {
    static count() {
        return measures_1.createMeasure("count", plywood_1.$("main").count());
    }
    static added() {
        return measures_1.createMeasure("added", plywood_1.$("main").sum(plywood_1.$("added")));
    }
    static avgAdded() {
        return measures_1.createMeasure("avg_added", plywood_1.$("main").average(plywood_1.$("added")));
    }
    static delta() {
        return measures_1.createMeasure("delta", plywood_1.$("main").sum(plywood_1.$("delta")));
    }
    static avgDelta() {
        return measures_1.createMeasure("avg_delta", plywood_1.$("main").average(plywood_1.$("delta")));
    }
    static histogram() {
        return measures_1.createMeasure("histogram", plywood_1.$("main").quantile(plywood_1.$("create_to_collect_duration_histogram"), 0.95, "k=128"));
    }
    static wikiCountJS() {
        return {
            name: "count",
            title: "Count",
            formula: "$main.sum($count)"
        };
    }
    static previousWikiCountJS() {
        return {
            name: "_previous__count",
            title: "Count",
            formula: "$main.sum($count)"
        };
    }
    static deltaWikiCountJS() {
        return {
            name: "_delta__count",
            title: "Count",
            formula: "$main.sum($count)"
        };
    }
    static wikiUniqueUsers() {
        return measures_1.createMeasure("unique_users", plywood_1.$("main").countDistinct(plywood_1.$("unique_users")));
    }
}
exports.MeasureFixtures = MeasureFixtures;
//# sourceMappingURL=measure.fixtures.js.map