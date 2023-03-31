"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const chai_1 = require("chai");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const logger_1 = require("../../../common/logger/logger");
const app_settings_fixtures_1 = require("../../../common/models/app-settings/app-settings.fixtures");
const filter_clause_fixtures_1 = require("../../../common/models/filter-clause/filter-clause.fixtures");
const sources_fixtures_1 = require("../../../common/models/sources/sources.fixtures");
const split_fixtures_1 = require("../../../common/models/split/split.fixtures");
const timekeeper_fixtures_1 = require("../../../common/models/timekeeper/timekeeper.fixtures");
const general_1 = require("../../../common/utils/general/general");
const filter_definition_1 = require("../../../common/view-definitions/version-4/filter-definition");
const split_definition_1 = require("../../../common/view-definitions/version-4/split-definition");
const view_definition_4_fixture_1 = require("../../../common/view-definitions/version-4/view-definition-4.fixture");
const query_1 = require("./query");
const settingsManagerFixture = {
    getSources: () => Promise.resolve(sources_fixtures_1.wikiSourcesWithExecutor),
    anchorPath: ".",
    logger: logger_1.getLogger("error"),
    getTimekeeper: () => timekeeper_fixtures_1.TimekeeperFixtures.wiki(),
    appSettings: app_settings_fixtures_1.appSettings
};
const serializeSplit = (split) => split_definition_1.splitConverter.fromSplitCombine(split);
const serializeClause = (clause) => filter_definition_1.filterDefinitionConverter.fromFilterClause(clause);
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use("/", query_1.queryRouter(settingsManagerFixture));
describe("query router", () => {
    describe("QueryRouterRequest", () => {
        it("should require dataCube", (testComplete) => {
            supertest_1.default(app)
                .post("/")
                .set("Content-Type", "application/json")
                .send({})
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Parameter dataCube is required" })
                .end(testComplete);
        });
        it("should validate viewDefinition", (testComplete) => {
            supertest_1.default(app)
                .post("/")
                .set("Content-Type", "application/json")
                .send({ dataCube: "wiki" })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Parameter viewDefinition is required" })
                .end(testComplete);
        });
        it("should create context", (testComplete) => {
            const withMiddleware = express_1.default()
                .use(body_parser_1.default.json())
                .use("/", query_1.queryRouter(settingsManagerFixture))
                .use((req, res) => {
                const { essence, dataCube, timekeeper, decorator } = req.context;
                res.status(200).send({
                    essence: !general_1.isNil(essence),
                    dataCube: !general_1.isNil(dataCube),
                    decorator: !general_1.isNil(decorator),
                    timekeeper: !general_1.isNil(timekeeper)
                });
            });
            supertest_1.default(withMiddleware)
                .post("/")
                .set("Content-Type", "application/json")
                .send({ dataCube: "wiki", viewDefinition: view_definition_4_fixture_1.total })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .expect((res) => {
                chai_1.expect(res.body).to.have.property("decorator");
                chai_1.expect(res.body).to.have.property("essence");
                chai_1.expect(res.body).to.have.property("dataCube");
                chai_1.expect(res.body).to.have.property("timekeeper");
            })
                .end(testComplete);
        });
    });
    describe("visualization endpoint", () => {
        it("should return 200 for valid parameters", (testComplete) => {
            supertest_1.default(app)
                .post("/visualization")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(testComplete);
        });
    });
    describe("raw data endpoint", () => {
        it("should return 200 for valid parameters", (testComplete) => {
            supertest_1.default(app)
                .post("/raw-data")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(testComplete);
        });
    });
    describe("pinboard endpoint", () => {
        it("should validate split", (testComplete) => {
            supertest_1.default(app)
                .post("/pinboard")
                .set("Content-Type", "application/json")
                .send({ dataCube: "wiki", viewDefinition: view_definition_4_fixture_1.total })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Parameter split is required" })
                .end(testComplete);
        });
        it("should fail with faulty split definition", (testComplete) => {
            supertest_1.default(app)
                .post("/pinboard")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                split: true
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Dimension undefined not found in data cube wiki." })
                .end(testComplete);
        });
        it("should return 200 for valid parameters", (testComplete) => {
            const split = serializeSplit(split_fixtures_1.stringSplitCombine("channel", { sort: { reference: "count" } }));
            supertest_1.default(app)
                .post("/pinboard")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                split
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(testComplete);
        });
    });
    describe("boolean filter endpoint", () => {
        it("should validate dimension", (testComplete) => {
            supertest_1.default(app)
                .post("/boolean-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Parameter dimension is required" })
                .end(testComplete);
        });
        it("should validate non-existent dimension", (testComplete) => {
            supertest_1.default(app)
                .post("/boolean-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                dimension: "foobar"
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Unknown dimension: foobar" })
                .end(testComplete);
        });
        it("should return 200 for valid parameters", (testComplete) => {
            supertest_1.default(app)
                .post("/boolean-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                dimension: "isRobot"
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(testComplete);
        });
    });
    describe("number-filter endpoint", () => {
        it("should validate dimension", (testComplete) => {
            supertest_1.default(app)
                .post("/number-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Parameter dimension is required" })
                .end(testComplete);
        });
        it("should validate non-existent dimension", (testComplete) => {
            supertest_1.default(app)
                .post("/number-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                dimension: "foobar"
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Unknown dimension: foobar" })
                .end(testComplete);
        });
        it("should return 200 for valid parameters", (testComplete) => {
            supertest_1.default(app)
                .post("/number-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                dimension: "commentLength"
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(testComplete);
        });
    });
    describe("string-filter endpoint", () => {
        it("should validate clause", (testComplete) => {
            supertest_1.default(app)
                .post("/string-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Parameter clause is required" })
                .end(testComplete);
        });
        it("should validate incorrect clause", (testComplete) => {
            supertest_1.default(app)
                .post("/string-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                clause: "foobar"
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect({ error: "Dimension name cannot be empty." })
                .end(testComplete);
        });
        it("should return 200 for valid parameters", (testComplete) => {
            const clause = serializeClause(filter_clause_fixtures_1.stringContains("channel", "e"));
            supertest_1.default(app)
                .post("/string-filter")
                .set("Content-Type", "application/json")
                .send({
                dataCube: "wiki",
                viewDefinition: view_definition_4_fixture_1.total,
                clause
            })
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .end(testComplete);
        });
    });
});
//# sourceMappingURL=query.mocha.js.map