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
const plywood_1 = require("plywood");
const supertest_1 = __importDefault(require("supertest"));
const logger_1 = require("../../../common/logger/logger");
const sources_fixtures_1 = require("../../../common/models/sources/sources.fixtures");
const plywood_2 = require("./plywood");
const settingsManagerFixture = {
    getSources: () => Promise.resolve(sources_fixtures_1.wikiSourcesWithExecutor),
    anchorPath: ".",
    logger: logger_1.NOOP_LOGGER
};
const app = express_1.default();
app.use(bodyParser.json());
app.use("/", plywood_2.plywoodRouter(settingsManagerFixture));
describe("plywood router", () => {
    it("must have dataCube", (testComplete) => {
        supertest_1.default(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send({
            version: "0.9.4",
            expression: plywood_1.$("main").toJS()
        })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .expect({ error: "Parameter dataCube is required" }, testComplete);
    });
    it("does a query (value)", (testComplete) => {
        supertest_1.default(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send({
            version: "0.9.4",
            expression: plywood_1.$("main").count().toJS(),
            dataCube: "wiki"
        })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect({ result: 10 }, testComplete);
    });
    it("does a query (dataset)", (testComplete) => {
        supertest_1.default(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send({
            version: "0.9.4",
            expression: plywood_1.$("main")
                .split("$channel", "Channel")
                .apply("Count", plywood_1.$("main").count())
                .sort("$Count", "descending")
                .limit(2)
                .toJS(),
            dataSource: "wiki"
        })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect({
            result: {
                attributes: [
                    {
                        name: "Channel",
                        type: "STRING"
                    },
                    {
                        name: "main",
                        type: "DATASET"
                    },
                    {
                        name: "Count",
                        type: "NUMBER"
                    }
                ],
                data: [
                    {
                        Channel: "en",
                        Count: 4
                    },
                    {
                        Channel: "vi",
                        Count: 4
                    }
                ],
                keys: [
                    "Channel"
                ]
            }
        }, testComplete);
    });
});
//# sourceMappingURL=plywood.mocha.js.map