"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_class_1 = require("immutable-class");
const general_1 = require("../../utils/general/general");
const cluster_1 = require("../cluster/cluster");
const find_cluster_1 = require("../cluster/find-cluster");
const data_cube_1 = require("../data-cube/data-cube");
const queryable_data_cube_1 = require("../data-cube/queryable-data-cube");
function readClusters({ clusters, druidHost, brokerHost }, logger) {
    if (Array.isArray(clusters))
        return clusters.map(cluster => cluster_1.fromConfig(cluster, logger));
    if (general_1.isTruthy(druidHost) || general_1.isTruthy(brokerHost)) {
        return [cluster_1.fromConfig({
                name: "druid",
                url: druidHost || brokerHost
            }, logger)];
    }
    return [];
}
function readDataCubes({ dataCubes, dataSources }, clusters, logger) {
    const cubes = dataCubes || dataSources || [];
    return cubes.map(cube => {
        const cluster = find_cluster_1.findCluster(cube, clusters);
        return data_cube_1.fromConfig(cube, cluster, logger);
    });
}
function fromConfig(config, logger) {
    const clusters = readClusters(config, logger);
    const dataCubes = readDataCubes(config, clusters, logger);
    return {
        clusters,
        dataCubes
    };
}
exports.fromConfig = fromConfig;
function serialize({ clusters: serverClusters, dataCubes: serverDataCubes }) {
    const clusters = serverClusters.map(cluster_1.serialize);
    const dataCubes = serverDataCubes
        .filter(dc => queryable_data_cube_1.isQueryable(dc))
        .map(data_cube_1.serialize);
    return {
        clusters,
        dataCubes
    };
}
exports.serialize = serialize;
function getDataCubesForCluster(sources, clusterName) {
    return sources.dataCubes.filter(dataCube => dataCube.clusterName === clusterName);
}
exports.getDataCubesForCluster = getDataCubesForCluster;
function getDataCube(sources, dataCubeName) {
    return immutable_class_1.NamedArray.findByName(sources.dataCubes, dataCubeName);
}
exports.getDataCube = getDataCube;
function addOrUpdateDataCube(sources, dataCube) {
    const dataCubes = immutable_class_1.NamedArray.overrideByName(sources.dataCubes, dataCube);
    return {
        ...sources,
        dataCubes
    };
}
exports.addOrUpdateDataCube = addOrUpdateDataCube;
function deleteDataCube(sources, dataCube) {
    return {
        ...sources,
        dataCubes: sources.dataCubes.filter(dc => dc.name !== dataCube.name)
    };
}
exports.deleteDataCube = deleteDataCube;
//# sourceMappingURL=sources.js.map