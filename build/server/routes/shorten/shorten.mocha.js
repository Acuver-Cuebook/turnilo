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
const customization_1 = require("../../../common/models/customization/customization");
const url_shortener_fixtures_1 = require("../../../common/models/url-shortener/url-shortener.fixtures");
const shorten_1 = require("./shorten");
const shortenPath = "/shorten";
const settingsFactory = (urlShortener) => ({
    logger: logger_1.NOOP_LOGGER,
    appSettings: {
        ...app_settings_fixtures_1.appSettings,
        customization: customization_1.fromConfig({
            urlShortener
        }, logger_1.NOOP_LOGGER)
    }
});
const callShortener = (app) => supertest_1.default(app)
    .get(shortenPath)
    .set("Content-Type", "application/json")
    .send({ url: "http://foobar.com?bazz=quvx" });
describe("url shortener", () => {
    let app;
    let server;
    describe("with succesful shortener", () => {
        before(done => {
            app = express_1.default();
            app.use(shortenPath, shorten_1.shortenRouter(settingsFactory(url_shortener_fixtures_1.SuccessUrlShortenerJS), true));
            server = app.listen(0, done);
        });
        after(done => {
            server.close(done);
        });
        it("should shorten url", (testComplete) => {
            callShortener(app)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .expect({ shortUrl: "http://foobar" }, testComplete);
        });
    });
    describe("without failing shortener", () => {
        before(done => {
            app = express_1.default();
            app.use(shortenPath, shorten_1.shortenRouter(settingsFactory(url_shortener_fixtures_1.FailUrlShortenerJS), true));
            app.use(bodyParser.json());
            server = app.listen(0, done);
        });
        after(done => {
            server.close(done);
        });
        it("should return error", (testComplete) => {
            callShortener(app)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(500)
                .expect({ error: "could not shorten url", message: "error message" }, testComplete);
        });
    });
});
//# sourceMappingURL=shorten.mocha.js.map