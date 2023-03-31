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
const supertest_1 = __importDefault(require("supertest"));
const logger_1 = require("../../../common/logger/logger");
const app_settings_fixtures_1 = require("../../../common/models/app-settings/app-settings.fixtures");
const sources_fixtures_1 = require("../../../common/models/sources/sources.fixtures");
const view_definition_converter_2_fixtures_1 = require("../../../common/view-definitions/version-2/view-definition-converter-2.fixtures");
const mkurl_1 = require("./mkurl");
const app = express_1.default();
app.use(bodyParser.json());
app.use("/", mkurl_1.mkurlRouter({
    appSettings: app_settings_fixtures_1.appSettings,
    getSources: () => Promise.resolve(sources_fixtures_1.wikiSourcesWithExecutor),
    logger: logger_1.NOOP_LOGGER
}));
describe("mkurl router", () => {
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
    it("should require viewDefinitionVersion", (testComplete) => {
        supertest_1.default(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send({ dataCube: "wiki", viewDefinition: {} })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .expect({ error: "Parameter viewDefinitionVersion is required" })
            .end(testComplete);
    });
    it("should validate viewDefinitionVersion", (testComplete) => {
        supertest_1.default(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send({ dataCube: "wiki", viewDefinition: {}, viewDefinitionVersion: "foobar" })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .expect({ error: "Unsupported viewDefinitionVersion value: foobar" })
            .end(testComplete);
    });
    it("should return 200 for valid parameters", (testComplete) => {
        supertest_1.default(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send({
            dataCubeName: "wiki",
            viewDefinitionVersion: "2",
            viewDefinition: view_definition_converter_2_fixtures_1.ViewDefinitionConverter2Fixtures.fullTable()
        })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end(testComplete);
    });
});
//# sourceMappingURL=mkurl.mocha.js.map