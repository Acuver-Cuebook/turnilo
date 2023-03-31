"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const dimension_1 = require("./dimension");
class DimensionFixtures {
    static wikiTime() {
        return dimension_1.createDimension("time", "time", plywood_1.$("time"));
    }
    static wikiIsRobot() {
        return dimension_1.createDimension("boolean", "isRobot", plywood_1.$("isRobot"));
    }
    static wikiChannel() {
        return dimension_1.createDimension("string", "channel", plywood_1.$("channel"));
    }
    static countryString() {
        return {
            ...dimension_1.createDimension("string", "country", plywood_1.$("country")),
            title: "important countries"
        };
    }
    static countryURL() {
        return {
            ...dimension_1.createDimension("string", "country", plywood_1.$("country")),
            title: "important countries",
            url: "https://www.country.com/%s"
        };
    }
    static time() {
        return {
            ...dimension_1.createDimension("time", "time", plywood_1.$("time")),
            url: "http://www.time.com/%s"
        };
    }
    static number() {
        return dimension_1.createDimension("number", "numeric", plywood_1.$("n"));
    }
    static tweetLength() {
        return dimension_1.createDimension("number", "tweetLength", plywood_1.$("tweetLength"));
    }
    static wikiCommentLength() {
        return dimension_1.createDimension("number", "commentLength", plywood_1.$("commentLength"));
    }
    static comment() {
        return dimension_1.createDimension("string", "comment", plywood_1.$("comment"));
    }
    static commentOver100() {
        return dimension_1.createDimension("boolean", "commentLengthOver100", plywood_1.Expression.parse("$commentLength > 100"));
    }
    static twitterHandle() {
        return dimension_1.createDimension("string", "twitterHandle", plywood_1.$("twitterHandle"));
    }
    static namespace() {
        return dimension_1.createDimension("string", "namespace", plywood_1.$("namespace"));
    }
    static articleName() {
        return dimension_1.createDimension("string", "articleName", plywood_1.$("articleName"));
    }
    static page() {
        return dimension_1.createDimension("string", "page", plywood_1.$("page"));
    }
    static userChars() {
        return dimension_1.createDimension("string", "userChars", plywood_1.$("userChars"));
    }
    static pageLastAuthor() {
        return dimension_1.createDimension("string", "page_last_author", plywood_1.Expression.parse("$page.lookup(page_last_author)"));
    }
}
exports.DimensionFixtures = DimensionFixtures;
//# sourceMappingURL=dimension.fixtures.js.map