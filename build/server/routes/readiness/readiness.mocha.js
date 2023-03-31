"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nock_1 = __importDefault(require("nock"));
const supertest_1 = __importDefault(require("supertest"));
const logger_1 = require("../../../common/logger/logger");
const cluster_fixtures_1 = require("../../../common/models/cluster/cluster.fixtures");
const sources_fixtures_1 = require("../../../common/models/sources/sources.fixtures");
const readiness_1 = require("./readiness");
const loadStatusPath = "/druid/broker/v1/loadstatus";
const wikiBrokerNock = nock_1.default(`${cluster_fixtures_1.ClusterFixtures.druidWikiClusterJS().url}`);
const twitterBrokerNock = nock_1.default(`${cluster_fixtures_1.ClusterFixtures.druidTwitterClusterJS().url}`);
const mockLoadStatus = (nock, fixture) => {
    const { status, initialized, delay } = fixture;
    nock
        .get(loadStatusPath)
        .delay(delay)
        .reply(status, { inventoryInitialized: initialized });
};
describe("readiness router", () => {
    let app;
    let server;
    describe("single druid cluster", () => {
        before(done => {
            app = express_1.default();
            app.use("/", readiness_1.readinessRouter({ getSources: () => Promise.resolve(sources_fixtures_1.wikiSources), logger: logger_1.NOOP_LOGGER }));
            server = app.listen(0, done);
        });
        after(done => {
            server.close(done);
        });
        const singleClusterTests = [
            { scenario: "healthy broker", status: 200, initialized: true, delay: 0, expectedStatus: 200 },
            { scenario: "unhealthy broker", status: 500, initialized: false, delay: 0, expectedStatus: 503 },
            { scenario: "uninitialized broker", status: 200, initialized: false, delay: 0, expectedStatus: 503 },
            { scenario: "timeout to broker", status: 200, initialized: true, delay: 200, expectedStatus: 503 }
        ];
        singleClusterTests.forEach(({ scenario, status, initialized, delay, expectedStatus }) => {
            it(`returns ${expectedStatus} with ${scenario}`, testComplete => {
                mockLoadStatus(wikiBrokerNock, { status, initialized, delay });
                supertest_1.default(app)
                    .get("/")
                    .expect(expectedStatus, testComplete);
            });
        });
    });
    describe("multiple druid clusters", () => {
        before(done => {
            app = express_1.default();
            app.use("/", readiness_1.readinessRouter({ getSources: () => Promise.resolve(sources_fixtures_1.wikiTwitterSources), logger: logger_1.NOOP_LOGGER }));
            server = app.listen(0, done);
        });
        after(done => {
            server.close(done);
        });
        const multipleClustersTests = [
            {
                scenario: "all healthy brokers",
                wikiBroker: { status: 200, initialized: true, delay: 0 },
                twitterBroker: { status: 200, initialized: true, delay: 0 },
                expectedStatus: 200
            },
            {
                scenario: "single unhealthy broker",
                wikiBroker: { status: 500, initialized: true, delay: 0 },
                twitterBroker: { status: 200, initialized: true, delay: 0 },
                expectedStatus: 503
            },
            {
                scenario: "single uninitialized broker",
                wikiBroker: { status: 200, initialized: true, delay: 0 },
                twitterBroker: { status: 200, initialized: false, delay: 0 },
                expectedStatus: 503
            },
            {
                scenario: "timeout to single broker",
                wikiBroker: { status: 200, initialized: true, delay: 100 },
                twitterBroker: { status: 200, initialized: true, delay: 0 },
                expectedStatus: 503
            }
        ];
        multipleClustersTests.forEach(({ scenario, wikiBroker, twitterBroker, expectedStatus }) => {
            it(`returns ${expectedStatus} with ${scenario}`, testComplete => {
                mockLoadStatus(wikiBrokerNock, wikiBroker);
                mockLoadStatus(twitterBrokerNock, twitterBroker);
                supertest_1.default(app)
                    .get("/")
                    .expect(expectedStatus, testComplete);
            });
        });
    });
});
//# sourceMappingURL=readiness.mocha.js.map