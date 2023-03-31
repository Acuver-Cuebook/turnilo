"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../common/logger/logger");
const cluster_1 = require("../../../common/models/cluster/cluster");
const data_cube_1 = require("../../../common/models/data-cube/data-cube");
const queryable_data_cube_1 = require("../../../common/models/data-cube/queryable-data-cube");
const sources_1 = require("../../../common/models/sources/sources");
const datacube_to_external_1 = __importDefault(require("../../../common/utils/external/datacube-to-external"));
const functional_1 = require("../../../common/utils/functional/functional");
const general_1 = require("../../../common/utils/general/general");
const promise_1 = require("../../../common/utils/promise/promise");
const time_monitor_1 = require("../../../common/utils/time-monitor/time-monitor");
const cluster_manager_1 = require("../cluster-manager/cluster-manager");
const file_manager_1 = require("../file-manager/file-manager");
class SettingsManager {
    constructor(appSettings, sources, options) {
        this.sourcesGetter = opts => this.getSources(opts);
        this.generateDataCubeName = (external) => {
            const { sources } = this;
            const source = String(external.source);
            let candidateName = source;
            let i = 0;
            while (sources_1.getDataCube(sources, candidateName)) {
                i++;
                candidateName = source + i;
            }
            return candidateName;
        };
        this.onDatasetChange = (dataCubeName, changedDataset) => {
            const { logger, sources } = this;
            logger.log(`Got native dataset update for ${dataCubeName}`);
            const dataCube = sources_1.getDataCube(sources, dataCubeName);
            if (!dataCube)
                throw new Error(`Unknown dataset ${dataCubeName}`);
            const queryableDataCube = queryable_data_cube_1.attachDatasetExecutor(dataCube, changedDataset);
            if (queryableDataCube.refreshRule.isQuery()) {
                this.timeMonitor.addCheck(queryableDataCube, cluster_1.DEFAULT_SOURCE_TIME_BOUNDARY_REFRESH_INTERVAL);
            }
            this.sources = sources_1.addOrUpdateDataCube(sources, queryableDataCube);
        };
        this.onExternalChange = (cluster, dataCubeName, changedExternal) => {
            if (!changedExternal.attributes || !changedExternal.requester)
                return Promise.resolve(null);
            const { sources, logger } = this;
            logger.log(`Got queryable external dataset update for ${dataCubeName} in cluster ${cluster.name}`);
            let dataCube = sources_1.getDataCube(sources, dataCubeName);
            if (!dataCube) {
                dataCube = data_cube_1.fromClusterAndExternal(dataCubeName, cluster, changedExternal, this.logger);
            }
            const queryableDataCube = queryable_data_cube_1.attachExternalExecutor(dataCube, changedExternal);
            if (queryableDataCube.refreshRule.isQuery()) {
                this.timeMonitor.addCheck(queryableDataCube, cluster.sourceTimeBoundaryRefreshInterval);
            }
            this.sources = sources_1.addOrUpdateDataCube(sources, queryableDataCube);
            return Promise.resolve(null);
        };
        this.onExternalRemoved = (cluster, dataCubeName, changedExternal) => {
            if (!changedExternal.attributes || !changedExternal.requester)
                return Promise.resolve(null);
            const { sources, logger } = this;
            logger.log(`Got external dataset removal for ${dataCubeName} in cluster ${cluster.name}`);
            const dataCube = sources_1.getDataCube(sources, dataCubeName);
            if (dataCube) {
                this.sources = sources_1.deleteDataCube(sources, dataCube);
                this.timeMonitor.removeCheck(dataCube);
            }
            return Promise.resolve(null);
        };
        const logger = logger_1.getLogger(options.logger);
        this.logger = logger;
        this.verbose = Boolean(options.verbose);
        this.anchorPath = options.anchorPath;
        this.timeMonitor = new time_monitor_1.TimeMonitor(logger);
        this.appSettings = appSettings;
        this.fileManagers = [];
        this.clusterManagers = [];
        this.initialLoadTimeout = options.initialLoadTimeout || 30000;
        this.sources = sources;
        this.settingsLoaded = this.reviseSources()
            .catch(e => {
            logger.error(`Fatal settings load error: ${e.message}`);
            logger.error(e.stack);
            throw e;
        });
    }
    addClusterManager(cluster, dataCubes) {
        const { verbose, logger, anchorPath } = this;
        const initialExternals = dataCubes.map(dataCube => {
            return {
                name: dataCube.name,
                external: datacube_to_external_1.default(dataCube),
                suppressIntrospection: dataCube.introspection === "none"
            };
        });
        logger.log(`Adding cluster manager for '${cluster.name}' with ${general_1.pluralIfNeeded(dataCubes.length, "dataCube")}`);
        const clusterManager = new cluster_manager_1.ClusterManager(cluster, {
            logger,
            verbose,
            anchorPath,
            initialExternals,
            onExternalChange: (name, external) => this.onExternalChange(cluster, name, external),
            onExternalRemoved: (name, external) => this.onExternalRemoved(cluster, name, external),
            generateExternalName: this.generateDataCubeName
        });
        this.clusterManagers.push(clusterManager);
        return clusterManager.init();
    }
    addFileManager(dataCube) {
        if (dataCube.clusterName !== "native")
            throw new Error(`data cube '${dataCube.name}' must be native to have a file manager`);
        if (Array.isArray(dataCube.source))
            throw new Error(`native data cube can't have multiple sources: ${dataCube.source.join(", ")}`);
        const { verbose, logger, anchorPath } = this;
        const fileManager = new file_manager_1.FileManager({
            logger,
            verbose,
            anchorPath,
            uri: dataCube.source,
            subsetExpression: dataCube.subsetExpression,
            onDatasetChange: dataset => this.onDatasetChange(dataCube.name, dataset)
        });
        this.fileManagers.push(fileManager);
        return fileManager.init();
    }
    getTimekeeper() {
        return this.timeMonitor.timekeeper;
    }
    handleSourcesTask(task, opts = {}) {
        const timeoutMs = opts.timeout || this.initialLoadTimeout;
        if (timeoutMs === 0) {
            return task.then(() => this.sources);
        }
        return Promise.race([task, promise_1.timeout(timeoutMs)])
            .catch(() => {
            this.logger.warn(`Settings load timeout (${timeoutMs}ms) hit, continuing`);
        })
            .then(() => this.sources);
    }
    getFreshSources(opts = {}) {
        const task = this.settingsLoaded.then(() => {
            return Promise.all(this.clusterManagers.map(clusterManager => clusterManager.refresh()));
        });
        return this.handleSourcesTask(task, opts);
    }
    getSources(opts = {}) {
        return this.handleSourcesTask(this.settingsLoaded, opts);
    }
    reviseSources() {
        const { sources } = this;
        const tasks = [
            this.reviseClusters(sources),
            this.reviseDataCubes(sources)
        ];
        return Promise.all(tasks).then(functional_1.noop);
    }
    reviseClusters(sources) {
        const { clusters } = sources;
        const tasks = clusters.map(cluster => this.addClusterManager(cluster, sources_1.getDataCubesForCluster(sources, cluster.name)));
        return Promise.all(tasks).then(functional_1.noop);
    }
    reviseDataCubes(sources) {
        const nativeDataCubes = sources_1.getDataCubesForCluster(sources, "native");
        const tasks = nativeDataCubes.map(dc => this.addFileManager(dc));
        return Promise.all(tasks).then(functional_1.noop);
    }
}
exports.SettingsManager = SettingsManager;
//# sourceMappingURL=settings-manager.js.map