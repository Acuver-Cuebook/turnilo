"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mime_1 = __importDefault(require("mime"));
const supertest_1 = __importDefault(require("supertest"));
const sources_fixtures_1 = require("../../../common/models/sources/sources.fixtures");
const plyql_1 = require("./plyql");
const app = express_1.default();
app.use(bodyParser.json());
app.use("/", plyql_1.plyqlRouter({ getSources: () => Promise.resolve(sources_fixtures_1.wikiSourcesWithExecutor) }));
const pageQuery = "SELECT SUM(added) as Added FROM `wiki` GROUP BY page ORDER BY Added DESC LIMIT 10;";
const timeQuery = "SELECT TIME_BUCKET(time, 'PT1H', 'Etc/UTC') as TimeByHour, SUM(added) as Added FROM `wiki` GROUP BY 1 ORDER BY TimeByHour ASC";
const tests = [
    {
        outputType: "json",
        query: pageQuery,
        testName: "POST json pages added"
    },
    {
        outputType: "json",
        query: timeQuery,
        testName: "POST json timeseries"
    },
    {
        outputType: "csv",
        query: pageQuery,
        testName: "POST csv pages added"
    },
    {
        outputType: "csv",
        query: timeQuery,
        testName: "POST csv timeseries"
    },
    {
        outputType: "tsv",
        query: pageQuery,
        testName: "POST tsv pages added"
    },
    {
        outputType: "tsv",
        query: timeQuery,
        testName: "POST tsv timeseries"
    }
];
function testPlyqlHelper(testName, contentType, queryStr) {
    it(testName, (testComplete) => {
        supertest_1.default(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(queryStr)
            .expect("Content-Type", contentType + "; charset=utf-8")
            .expect(200, testComplete);
    });
}
describe("plyql router", () => {
    tests.forEach(test => {
        testPlyqlHelper(test.testName, mime_1.default.getType(test.outputType), JSON.stringify(test, null, 2));
    });
});
//# sourceMappingURL=plyql.mocha.js.map