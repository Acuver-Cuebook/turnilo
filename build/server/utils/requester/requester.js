"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const plywood_druid_requester_1 = require("plywood-druid-requester");
const url_1 = require("url");
const functional_1 = require("../../../common/utils/functional/functional");
function httpToPlywoodProtocol(protocol) {
    if (protocol === "https:")
        return "tls";
    return "plain";
}
function defaultPort(protocol) {
    switch (protocol) {
        case "http:":
            return 80;
        case "https:":
            return 443;
        default:
            throw new Error(`Unsupported protocol: ${protocol}`);
    }
}
function getHostAndProtocol(url) {
    const { protocol, port, hostname } = url;
    const plywoodProtocol = httpToPlywoodProtocol(protocol);
    return {
        protocol: plywoodProtocol,
        host: `${hostname}:${port || defaultPort(protocol)}`
    };
}
function createDruidRequester(cluster, requestDecorator) {
    const { host, protocol } = getHostAndProtocol(new url_1.URL(cluster.url));
    return plywood_druid_requester_1.druidRequesterFactory({ host, requestDecorator, protocol });
}
function setRetryOptions({ maxAttempts, delay }) {
    return (requester) => plywood_1.retryRequesterFactory({
        requester,
        retry: maxAttempts,
        delay,
        retryOnTimeout: true
    });
}
function setVerbose(requester) {
    return plywood_1.verboseRequesterFactory({ requester });
}
function setConcurrencyLimit(concurrentLimit) {
    return (requester) => plywood_1.concurrentLimitRequesterFactory({ requester, concurrentLimit });
}
function properRequesterFactory(options) {
    const { cluster, druidRequestDecorator, verbose, concurrentLimit } = options;
    return functional_1.threadConditionally(createDruidRequester(cluster, druidRequestDecorator), cluster.retry && setRetryOptions(cluster.retry), verbose && setVerbose, concurrentLimit && setConcurrencyLimit(concurrentLimit));
}
exports.properRequesterFactory = properRequesterFactory;
//# sourceMappingURL=requester.js.map