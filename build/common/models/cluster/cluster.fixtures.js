"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../logger/logger");
const cluster_1 = require("./cluster");
class ClusterFixtures {
    static druidWikiClusterJS() {
        return {
            name: "druid-wiki",
            url: "http://192.168.99.100",
            version: "0.9.1",
            timeout: 30000,
            healthCheckTimeout: 50,
            sourceListScan: "auto",
            sourceListRefreshInterval: 10000,
            sourceReintrospectInterval: 10000,
            introspectionStrategy: "segment-metadata-fallback"
        };
    }
    static druidWikiCluster() {
        return cluster_1.fromConfig(ClusterFixtures.druidWikiClusterJS(), logger_1.NOOP_LOGGER);
    }
    static druidTwitterClusterJS() {
        return {
            name: "druid-twitter",
            url: "http://192.168.99.101",
            version: "0.9.1",
            timeout: 30000,
            healthCheckTimeout: 200,
            sourceListScan: "auto",
            sourceListRefreshInterval: 10000,
            sourceReintrospectInterval: 10000,
            introspectionStrategy: "segment-metadata-fallback"
        };
    }
    static druidTwitterCluster() {
        return cluster_1.fromConfig(ClusterFixtures.druidTwitterClusterJS(), logger_1.NOOP_LOGGER);
    }
    static druidTwitterClusterJSWithGuard(guardDataCubes = true) {
        return cluster_1.fromConfig({
            name: "druid-custom",
            url: "http://192.168.99.101",
            version: "0.9.1",
            timeout: 30000,
            healthCheckTimeout: 200,
            sourceListScan: "auto",
            sourceListRefreshInterval: 10000,
            sourceReintrospectInterval: 10000,
            guardDataCubes,
            introspectionStrategy: "segment-metadata-fallback"
        }, logger_1.NOOP_LOGGER);
    }
}
exports.ClusterFixtures = ClusterFixtures;
//# sourceMappingURL=cluster.fixtures.js.map