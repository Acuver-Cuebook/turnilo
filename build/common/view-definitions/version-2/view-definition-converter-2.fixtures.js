"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const baseTableViewDefinition = {
    visualization: "table",
    timezone: "Etc/UTC",
    filter: {
        op: "overlap",
        operand: {
            op: "ref",
            name: "time"
        },
        expression: {
            op: "timeRange",
            operand: {
                op: "ref",
                name: "m"
            },
            duration: "P1D",
            step: -1
        }
    },
    splits: [],
    singleMeasure: "delta",
    multiMeasureMode: true,
    selectedMeasures: ["count"],
    pinnedDimensions: [],
    pinnedSort: "delta"
};
class ViewDefinitionConverter2Fixtures {
    static totals() {
        return {
            visualization: "totals",
            timezone: "Etc/UTC",
            filter: plywood_1.$("time").overlap(new Date("2015-09-12Z"), new Date("2015-09-13Z")),
            pinnedDimensions: [],
            singleMeasure: "count",
            selectedMeasures: [],
            splits: [],
            multiMeasureMode: false
        };
    }
    static fullTable() {
        return {
            visualization: "table",
            timezone: "Etc/UTC",
            filter: plywood_1.$("time")
                .overlap(new Date("2015-09-12Z"), new Date("2015-09-13Z"))
                .and(plywood_1.$("channel").overlap(["en"]))
                .and(plywood_1.$("isRobot").overlap([true]).not())
                .and(plywood_1.$("page").contains("Jeremy"))
                .and(plywood_1.$("userChars").match("^A$"))
                .and(plywood_1.$("commentLength").overlap([{ start: 3, end: null, type: "NUMBER_RANGE" }]))
                .toJS(),
            pinnedDimensions: ["channel", "namespace", "isRobot"],
            pinnedSort: "delta",
            singleMeasure: "delta",
            selectedMeasures: ["delta", "count", "added"],
            multiMeasureMode: true,
            splits: [
                {
                    expression: {
                        op: "ref",
                        name: "channel"
                    },
                    sortAction: {
                        op: "sort",
                        expression: {
                            op: "ref",
                            name: "delta"
                        },
                        direction: "descending"
                    },
                    limitAction: {
                        op: "limit",
                        value: 50
                    }
                },
                {
                    expression: {
                        op: "ref",
                        name: "isRobot"
                    },
                    sortAction: {
                        op: "sort",
                        expression: {
                            op: "ref",
                            name: "delta"
                        },
                        direction: "descending"
                    },
                    limitAction: {
                        op: "limit",
                        value: 5
                    }
                },
                {
                    expression: {
                        op: "ref",
                        name: "commentLength"
                    },
                    bucketAction: {
                        op: "numberBucket",
                        size: 10,
                        offset: 0
                    },
                    sortAction: {
                        op: "sort",
                        expression: {
                            op: "ref",
                            name: "delta"
                        },
                        direction: "descending"
                    },
                    limitAction: {
                        op: "limit",
                        value: 5
                    }
                },
                {
                    expression: {
                        op: "ref",
                        name: "time"
                    },
                    bucketAction: {
                        op: "timeBucket",
                        duration: "PT1H"
                    },
                    sortAction: {
                        op: "sort",
                        expression: {
                            op: "ref",
                            name: "delta"
                        },
                        direction: "descending"
                    }
                }
            ]
        };
    }
    static tableWithFilterExpression(expression) {
        return {
            ...baseTableViewDefinition,
            filter: {
                op: "overlap",
                operand: {
                    op: "ref",
                    name: "time"
                },
                expression
            }
        };
    }
    static tableWithFilterActions(actions) {
        return {
            ...baseTableViewDefinition,
            filter: {
                op: "chain",
                expression: {
                    op: "ref",
                    name: "time"
                },
                actions
            }
        };
    }
    static tableWithSplits(splits) {
        return {
            ...baseTableViewDefinition,
            splits
        };
    }
}
exports.ViewDefinitionConverter2Fixtures = ViewDefinitionConverter2Fixtures;
//# sourceMappingURL=view-definition-converter-2.fixtures.js.map