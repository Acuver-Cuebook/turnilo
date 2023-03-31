"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_fixtures_1 = require("../cluster/cluster.fixtures");
const data_cube_fixtures_1 = require("../data-cube/data-cube.fixtures");
exports.wikiSources = {
    clusters: [cluster_fixtures_1.ClusterFixtures.druidWikiCluster()],
    dataCubes: [data_cube_fixtures_1.wikiDataCube]
};
exports.wikiTwitterSources = {
    clusters: [cluster_fixtures_1.ClusterFixtures.druidWikiCluster(), cluster_fixtures_1.ClusterFixtures.druidTwitterCluster()],
    dataCubes: [data_cube_fixtures_1.wikiDataCube, data_cube_fixtures_1.twitterDataCube]
};
exports.wikiSourcesWithExecutor = {
    clusters: [data_cube_fixtures_1.wikiCubeWithExecutor.cluster],
    dataCubes: [data_cube_fixtures_1.wikiCubeWithExecutor]
};
//# sourceMappingURL=sources.fixtures.js.map