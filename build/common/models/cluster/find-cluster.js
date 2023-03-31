"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_class_1 = require("immutable-class");
function findCluster(dataCube, clusters) {
    const name = dataCube.clusterName || dataCube.engine;
    if (name === "native")
        return undefined;
    const cluster = immutable_class_1.NamedArray.findByName(clusters, name);
    if (!cluster)
        throw new Error(`Can not find cluster '${name}' for data cube '${dataCube.name}'`);
    return cluster;
}
exports.findCluster = findCluster;
//# sourceMappingURL=find-cluster.js.map