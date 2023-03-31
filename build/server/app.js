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
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const helmet_1 = require("helmet");
const path_1 = require("path");
const liveness_1 = require("./routes/liveness/liveness");
const mkurl_1 = require("./routes/mkurl/mkurl");
const plyql_1 = require("./routes/plyql/plyql");
const plywood_1 = require("./routes/plywood/plywood");
const query_1 = require("./routes/query/query");
const readiness_1 = require("./routes/readiness/readiness");
const shorten_1 = require("./routes/shorten/shorten");
const sources_1 = require("./routes/sources/sources");
const turnilo_1 = require("./routes/turnilo/turnilo");
const load_plugin_1 = require("./utils/plugin-loader/load-plugin");
const views_1 = require("./views");
function createApp(serverSettings, settingsManager, version) {
    const app = express_1.default();
    app.disable("x-powered-by");
    const isDev = app.get("env") === "development";
    const isTrustedProxy = serverSettings.trustProxy === "always";
    if (isTrustedProxy) {
        app.set("trust proxy", true);
    }
    const timeout = serverSettings.serverTimeout;
    app.use((req, res, next) => {
        res.setTimeout(timeout);
        next();
    });
    function getRoutePath(route) {
        const serverRoot = serverSettings.serverRoot;
        const prefix = serverRoot.length > 0 ? `/${serverRoot}` : "";
        return `${prefix}${route}`;
    }
    function attachRouter(route, router) {
        app.use(getRoutePath(route), router);
    }
    app.use(compression_1.default());
    if (serverSettings.strictTransportSecurity === "always") {
        app.use(helmet_1.hsts({
            maxAge: 10886400000,
            includeSubDomains: true,
            preload: true
        }));
    }
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    if (serverSettings.iframe === "deny") {
        app.use((req, res, next) => {
            res.setHeader("X-Frame-Options", "DENY");
            res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
            next();
        });
    }
    app.use((req, res, next) => {
        req.turniloMetadata = {};
        next();
    });
    serverSettings.plugins.forEach(({ path, name, settings }) => {
        try {
            settingsManager.logger.log(`Loading plugin ${name} module`);
            const module = load_plugin_1.loadPlugin(path, settingsManager.anchorPath);
            settingsManager.logger.log(`Invoking plugin ${name}`);
            module.plugin(app, settings, serverSettings, settingsManager.appSettings, settingsManager.sourcesGetter, settingsManager.logger.setLoggerId(name));
        }
        catch (e) {
            settingsManager.logger.warn(`Plugin ${name} threw an error: ${e.message}`);
        }
    });
    if (app.get("env") === "dev-hmr") {
        const webpack = require("webpack");
        const webpackConfig = require("../../config/webpack.dev");
        const webpackDevMiddleware = require("webpack-dev-middleware");
        const webpackHotMiddleware = require("webpack-hot-middleware");
        if (webpack && webpackDevMiddleware && webpackHotMiddleware) {
            const webpackCompiler = webpack(webpackConfig);
            app.use(webpackDevMiddleware(webpackCompiler, {
                hot: true,
                noInfo: true,
                publicPath: webpackConfig.output.publicPath
            }));
            app.use(webpackHotMiddleware(webpackCompiler, {
                log: console.log,
                path: "/__webpack_hmr"
            }));
        }
    }
    attachRouter("/", express_1.default.static(path_1.join(__dirname, "../../build/public")));
    attachRouter("/", express_1.default.static(path_1.join(__dirname, "../../assets")));
    attachRouter(serverSettings.readinessEndpoint, readiness_1.readinessRouter(settingsManager));
    attachRouter(serverSettings.livenessEndpoint, liveness_1.livenessRouter);
    attachRouter("/sources", sources_1.sourcesRouter(settingsManager));
    attachRouter("/plywood", plywood_1.plywoodRouter(settingsManager));
    attachRouter("/plyql", plyql_1.plyqlRouter(settingsManager));
    attachRouter("/mkurl", mkurl_1.mkurlRouter(settingsManager));
    attachRouter("/query", query_1.queryRouter(settingsManager));
    attachRouter("/shorten", shorten_1.shortenRouter(settingsManager, isTrustedProxy));
    attachRouter("/", turnilo_1.turniloRouter(settingsManager, version));
    app.use((req, res) => {
        res.redirect(getRoutePath("/"));
    });
    app.use((err, req, res, next) => {
        settingsManager.logger.error(`Server Error: ${err.message}`);
        settingsManager.logger.error(err.stack);
        res.status(err.status || 500);
        const error = isDev ? err : null;
        res.send(views_1.errorLayout({ version, title: "Error" }, err.message, error));
    });
    return app;
}
exports.default = createApp;
//# sourceMappingURL=app.js.map