"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request = __importStar(require("request-promise-native"));
const unhealthyHttpStatus = 503;
const healthyHttpStatus = 200;
var ClusterHealthStatus;
(function (ClusterHealthStatus) {
    ClusterHealthStatus["healthy"] = "healthy";
    ClusterHealthStatus["unhealthy"] = "unhealthy";
})(ClusterHealthStatus || (ClusterHealthStatus = {}));
const statusToHttpStatus = (status) => {
    switch (status) {
        case ClusterHealthStatus.healthy:
            return healthyHttpStatus;
        case ClusterHealthStatus.unhealthy:
            return unhealthyHttpStatus;
    }
};
async function checkDruidCluster(cluster) {
    const { url } = cluster;
    const loadStatusUrl = `${url}/druid/broker/v1/loadstatus`;
    try {
        const { inventoryInitialized } = await request
            .get(loadStatusUrl, { json: true, timeout: cluster.healthCheckTimeout })
            .promise();
        if (!inventoryInitialized) {
            return { url, status: ClusterHealthStatus.unhealthy, message: "inventory not initialized" };
        }
        return { url, status: ClusterHealthStatus.healthy, message: "" };
    }
    catch (reason) {
        const message = reason instanceof Error ? reason.message : "unknown";
        return { url, status: ClusterHealthStatus.unhealthy, message: `connection error: '${message}'` };
    }
}
function checkClusters(clusters) {
    const promises = clusters
        .filter(cluster => (cluster.type === "druid"))
        .map(checkDruidCluster);
    return Promise.all(promises);
}
function aggregateHealthStatus(clusterHealths) {
    const isSomeUnhealthy = clusterHealths.some(cluster => cluster.status === ClusterHealthStatus.unhealthy);
    return isSomeUnhealthy ? ClusterHealthStatus.unhealthy : ClusterHealthStatus.healthy;
}
function logUnhealthy(logger, clusterHealths) {
    const unhealthyClusters = clusterHealths.filter(({ status }) => status === ClusterHealthStatus.unhealthy);
    unhealthyClusters.forEach(({ message, url }) => {
        logger.log(`Unhealthy cluster url: ${url}. Message: ${message}`);
    });
}
function readinessRouter(settings) {
    const logger = settings.logger;
    const router = express_1.Router();
    router.get("/", async (req, res) => {
        try {
            const sources = await settings.getSources();
            const clusterHealths = await checkClusters(sources.clusters);
            logUnhealthy(logger, clusterHealths);
            const overallHealthStatus = aggregateHealthStatus(clusterHealths);
            const httpState = statusToHttpStatus(overallHealthStatus);
            res.status(httpState).send({ status: overallHealthStatus, clusters: clusterHealths });
        }
        catch (reason) {
            logger.warn(`Readiness check error: ${reason.message}`);
            res.status(unhealthyHttpStatus).send({ status: ClusterHealthStatus.unhealthy, message: reason.message });
        }
    });
    return router;
}
exports.readinessRouter = readinessRouter;
//# sourceMappingURL=readiness.js.map