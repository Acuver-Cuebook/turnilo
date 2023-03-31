"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_class_1 = require("immutable-class");
const plywood_1 = require("plywood");
const url_1 = require("url");
const request_decorator_1 = require("../../../server/utils/request-decorator/request-decorator");
const retry_options_1 = require("../../../server/utils/retry-options/retry-options");
const general_1 = require("../../utils/general/general");
const cluster_auth_1 = require("../cluster-auth/cluster-auth");
function ensureNotNative(name) {
    if (name === "native") {
        throw new Error("Cluster name can not be 'native'");
    }
}
function ensureNotTiny(v) {
    if (v === 0)
        return;
    if (v < 1000) {
        throw new Error(`Interval can not be < 1000 (is ${v})`);
    }
}
function validateUrl(url) {
    try {
        new url_1.URL(url);
    }
    catch (e) {
        throw new Error(`Cluster url: ${url} has invalid format. It should be http[s]://hostname[:port]`);
    }
}
const HTTP_PROTOCOL_TEST = /^http(s?):/;
function readUrl(cluster) {
    if (general_1.isTruthy(cluster.url)) {
        validateUrl(cluster.url);
        return cluster.url;
    }
    const oldHost = cluster.host || cluster.druidHost || cluster.brokerHost;
    if (general_1.isTruthy(oldHost)) {
        const url = HTTP_PROTOCOL_TEST.test(oldHost) ? oldHost : `http://${oldHost}`;
        validateUrl(url);
        return url;
    }
    throw new Error("Cluster: missing url field");
}
function readRequestDecorator(cluster, logger) {
    if (typeof cluster.requestDecorator === "string" || !general_1.isNil(cluster.decoratorOptions)) {
        logger.warn(`Cluster ${cluster.name} : requestDecorator as string and decoratorOptions fields are deprecated. Use object with path and options fields`);
        return request_decorator_1.RequestDecorator.fromJS({ path: cluster.requestDecorator, options: cluster.decoratorOptions });
    }
    if (general_1.isTruthy(cluster.requestDecorator))
        return request_decorator_1.RequestDecorator.fromJS(cluster.requestDecorator);
    return null;
}
const DEFAULT_HEALTH_CHECK_TIMEOUT = 1000;
exports.DEFAULT_SOURCE_LIST_SCAN = "auto";
const SOURCE_LIST_SCAN_VALUES = ["disable", "auto"];
exports.DEFAULT_SOURCE_LIST_REFRESH_INTERVAL = 0;
exports.DEFAULT_SOURCE_LIST_REFRESH_ON_LOAD = true;
exports.DEFAULT_SOURCE_REINTROSPECT_INTERVAL = 0;
exports.DEFAULT_SOURCE_REINTROSPECT_ON_LOAD = true;
exports.DEFAULT_SOURCE_TIME_BOUNDARY_REFRESH_INTERVAL = 60000;
exports.DEFAULT_INTROSPECTION_STRATEGY = "segment-metadata-fallback";
const DEFAULT_GUARD_DATA_CUBES = false;
function readInterval(value, defaultValue) {
    if (!general_1.isTruthy(value))
        return defaultValue;
    const numberValue = typeof value === "string" ? parseInt(value, 10) : value;
    immutable_class_1.BaseImmutable.ensure.number(numberValue);
    ensureNotTiny(numberValue);
    return numberValue;
}
function fromConfig(params, logger) {
    const { name, sourceListScan = exports.DEFAULT_SOURCE_LIST_SCAN, sourceListRefreshOnLoad = exports.DEFAULT_SOURCE_LIST_REFRESH_ON_LOAD, sourceReintrospectOnLoad = exports.DEFAULT_SOURCE_REINTROSPECT_ON_LOAD, version = null, title = "", guardDataCubes = DEFAULT_GUARD_DATA_CUBES, introspectionStrategy = exports.DEFAULT_INTROSPECTION_STRATEGY, healthCheckTimeout = DEFAULT_HEALTH_CHECK_TIMEOUT } = params;
    general_1.verifyUrlSafeName(name);
    ensureNotNative(name);
    general_1.optionalEnsureOneOf(sourceListScan, SOURCE_LIST_SCAN_VALUES, "Cluster: sourceListScan");
    const sourceReintrospectInterval = readInterval(params.sourceReintrospectInterval, exports.DEFAULT_SOURCE_REINTROSPECT_INTERVAL);
    const sourceListRefreshInterval = readInterval(params.sourceListRefreshInterval, exports.DEFAULT_SOURCE_LIST_REFRESH_INTERVAL);
    const sourceTimeBoundaryRefreshInterval = readInterval(params.sourceTimeBoundaryRefreshInterval, exports.DEFAULT_SOURCE_TIME_BOUNDARY_REFRESH_INTERVAL);
    const retry = retry_options_1.RetryOptions.fromJS(params.retry);
    const requestDecorator = readRequestDecorator(params, logger);
    const auth = cluster_auth_1.readClusterAuth(params.auth);
    const url = readUrl(params);
    return {
        type: "druid",
        timeout: typeof params.timeout === "string" ? parseInt(params.timeout, 10) : params.timeout,
        name,
        url,
        retry,
        requestDecorator,
        sourceListScan,
        sourceListRefreshInterval,
        sourceListRefreshOnLoad,
        sourceReintrospectInterval,
        sourceReintrospectOnLoad,
        sourceTimeBoundaryRefreshInterval,
        version,
        title,
        guardDataCubes,
        introspectionStrategy,
        healthCheckTimeout,
        auth
    };
}
exports.fromConfig = fromConfig;
function serialize(cluster) {
    return {
        type: "druid",
        name: cluster.name,
        timeout: cluster.timeout
    };
}
exports.serialize = serialize;
function makeExternalFromSourceName(source, version) {
    return plywood_1.External.fromValue({
        engine: "druid",
        source,
        version,
        suppress: true,
        allowSelectQueries: true,
        allowEternity: false
    });
}
exports.makeExternalFromSourceName = makeExternalFromSourceName;
function shouldScanSources(cluster) {
    return cluster.sourceListScan === "auto";
}
exports.shouldScanSources = shouldScanSources;
//# sourceMappingURL=cluster.js.map