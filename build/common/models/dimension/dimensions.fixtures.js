"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../../utils/object/object");
const dimension_fixtures_1 = require("./dimension.fixtures");
class DimensionsFixtures {
    static noTitleJS() {
        return {
            name: "dummyName",
            dimensions: [
                ...DimensionsFixtures.dimensions()
            ]
        };
    }
    static noNameJS() {
        return {
            dimensions: [
                ...DimensionsFixtures.dimensions()
            ]
        };
    }
    static noDimensionsJS() {
        return {
            name: "dummyName"
        };
    }
    static emptyDimensionsJS() {
        return {
            name: "dummyName",
            dimensions: []
        };
    }
    static dimensions() {
        return [
            {
                kind: "string",
                name: "comment",
                title: "Comment",
                formula: "$comment"
            },
            {
                kind: "number",
                name: "commentLength",
                title: "Comment Length",
                formula: "$commentLength"
            },
            {
                kind: "boolean",
                name: "commentLengthOver100",
                title: "Comment Length Over 100",
                formula: "$commentLength > 100"
            }
        ];
    }
    static fromDimensions(dimensions) {
        return {
            tree: dimensions.map(d => d.name),
            byName: object_1.fromEntries(dimensions.map(d => [d.name, d]))
        };
    }
    static wikiNames() {
        return ["time", "country", "channel", "comment", "commentLength", "commentLengthOver100", "isRobot", "namespace", "articleName", "page", "page_last_author", "userChars"];
    }
    static wiki() {
        const byName = {
            time: dimension_fixtures_1.DimensionFixtures.wikiTime(),
            country: dimension_fixtures_1.DimensionFixtures.countryString(),
            channel: dimension_fixtures_1.DimensionFixtures.wikiChannel(),
            comment: dimension_fixtures_1.DimensionFixtures.comment(),
            commentLength: dimension_fixtures_1.DimensionFixtures.wikiCommentLength(),
            commentLengthOver100: dimension_fixtures_1.DimensionFixtures.commentOver100(),
            isRobot: dimension_fixtures_1.DimensionFixtures.wikiIsRobot(),
            namespace: dimension_fixtures_1.DimensionFixtures.namespace(),
            articleName: dimension_fixtures_1.DimensionFixtures.articleName(),
            page: dimension_fixtures_1.DimensionFixtures.page(),
            page_last_author: dimension_fixtures_1.DimensionFixtures.pageLastAuthor(),
            userChars: dimension_fixtures_1.DimensionFixtures.userChars()
        };
        return {
            tree: ["time", "country", "channel", {
                    name: "comment_group",
                    title: "Comment Group",
                    dimensions: ["comment", "commentLength", "commentLengthOver100"]
                }, "isRobot", "namespace", "articleName", "page", "page_last_author", "userChars"],
            byName
        };
    }
    static twitter() {
        return DimensionsFixtures.fromDimensions([
            (dimension_fixtures_1.DimensionFixtures.time()),
            (dimension_fixtures_1.DimensionFixtures.twitterHandle()),
            (dimension_fixtures_1.DimensionFixtures.tweetLength())
        ]);
    }
}
exports.DimensionsFixtures = DimensionsFixtures;
//# sourceMappingURL=dimensions.fixtures.js.map