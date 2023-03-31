"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const cluster_1 = require("../../../common/models/cluster/cluster");
const functional_1 = require("../../../common/utils/functional/functional");
const general_1 = require("../../../common/utils/general/general");
const module_loader_1 = require("../module-loader/module-loader");
const requester_1 = require("../requester/requester");
const CONNECTION_RETRY_TIMEOUT = 20000;
const DRUID_REQUEST_DECORATOR_MODULE_VERSION = 1;
function emptyResolve() {
    return Promise.resolve(null);
}
function getSourceFromExternal(external) {
    return String(external.source);
}
function externalContainsSource(external, source) {
    return Array.isArray(external.source) ? external.source.indexOf(source) > -1 : String(external.source) === source;
}
class ClusterManager {
    constructor(cluster, options) {
        this.managedExternals = [];
        this.sourceListRefreshInterval = 0;
        this.sourceListRefreshTimer = null;
        this.sourceReintrospectInterval = 0;
        this.sourceReintrospectTimer = null;
        this.initialConnectionTimer = null;
        this.scanSourceList = () => {
            const { logger, cluster, verbose } = this;
            if (!cluster_1.shouldScanSources(cluster))
                return Promise.resolve(null);
            logger.log(`Scanning cluster '${cluster.name}' for new sources`);
            return plywood_1.External.getConstructorFor(cluster.type).getSourceList(this.requester)
                .then((sources) => {
                if (verbose)
                    logger.log(`For cluster '${cluster.name}' got sources: [${sources.join(", ")}]`);
                const introspectionTasks = [];
                this.managedExternals.forEach(ex => {
                    if (sources.find(src => src === String(ex.external.source)) == null) {
                        logger.log(`Missing source '${String(ex.external.source)}' + " for cluster '${cluster.name}', removing...`);
                        introspectionTasks.push(this.removeManagedExternal(ex));
                    }
                });
                sources.forEach(source => {
                    const existingExternalsForSource = this.managedExternals.filter(managedExternal => externalContainsSource(managedExternal.external, source));
                    if (existingExternalsForSource.length) {
                        if (verbose)
                            logger.log(`Cluster '${cluster.name}' already has an external for '${source}' ('${existingExternalsForSource[0].name}')`);
                        if (!this.introspectedSources[source]) {
                            logger.log(`Cluster '${cluster.name}' has never seen '${source}' and will introspect '${existingExternalsForSource[0].name}'`);
                            existingExternalsForSource.forEach(existingExternalForSource => {
                                introspectionTasks.push(this.introspectManagedExternal(existingExternalForSource));
                            });
                        }
                    }
                    else {
                        logger.log(`Cluster '${cluster.name}' making external for '${source}'`);
                        const external = cluster_1.makeExternalFromSourceName(source, this.version).attachRequester(this.requester);
                        const newManagedExternal = {
                            name: this.generateExternalName(external),
                            external,
                            autoDiscovered: true
                        };
                        introspectionTasks.push(this.addManagedExternal(newManagedExternal)
                            .then(() => this.introspectManagedExternal(newManagedExternal)));
                    }
                });
                return Promise.all(introspectionTasks);
            }, (e) => {
                logger.error(`Failed to get source list from cluster '${cluster.name}' because: ${e.message}`);
            });
        };
        this.introspectSources = () => {
            const { logger, cluster } = this;
            logger.log(`Introspecting all sources in cluster '${cluster.name}'`);
            return plywood_1.External.getConstructorFor(cluster.type).getSourceList(this.requester)
                .then((sources) => {
                const introspectionTasks = [];
                sources.forEach(source => {
                    const existingExternalsForSource = this.managedExternals.filter(managedExternal => externalContainsSource(managedExternal.external, source));
                    if (existingExternalsForSource.length) {
                        existingExternalsForSource.forEach(existingExternalForSource => {
                            introspectionTasks.push(this.introspectManagedExternal(existingExternalForSource));
                        });
                    }
                });
                return Promise.all(introspectionTasks);
            }, (e) => {
                logger.error(`Failed to get source list from cluster '${cluster.name}' because: ${e.message}`);
            });
        };
        if (!cluster)
            throw new Error("must have cluster");
        this.logger = options.logger;
        this.verbose = Boolean(options.verbose);
        this.anchorPath = options.anchorPath;
        this.cluster = cluster;
        this.initialConnectionEstablished = false;
        this.introspectedSources = {};
        this.version = cluster.version;
        this.managedExternals = options.initialExternals || [];
        this.onExternalChange = options.onExternalChange || emptyResolve;
        this.onExternalRemoved = options.onExternalRemoved || emptyResolve;
        this.generateExternalName = options.generateExternalName || getSourceFromExternal;
        this.requester = this.initRequester();
        this.managedExternals.forEach(managedExternal => {
            managedExternal.external = managedExternal.external.attachRequester(this.requester);
        });
    }
    init() {
        const { cluster, logger } = this;
        if (cluster.sourceListRefreshOnLoad) {
            logger.log(`Cluster '${cluster.name}' will refresh source list on load`);
        }
        if (cluster.sourceReintrospectOnLoad) {
            logger.log(`Cluster '${cluster.name}' will reintrospect sources on load`);
        }
        return this.establishInitialConnection()
            .then(() => this.introspectSources())
            .then(() => this.scanSourceList());
    }
    destroy() {
        if (this.sourceListRefreshTimer) {
            clearInterval(this.sourceListRefreshTimer);
            this.sourceListRefreshTimer = null;
        }
        if (this.sourceReintrospectTimer) {
            clearInterval(this.sourceReintrospectTimer);
            this.sourceReintrospectTimer = null;
        }
        if (this.initialConnectionTimer) {
            clearTimeout(this.initialConnectionTimer);
            this.initialConnectionTimer = null;
        }
    }
    addManagedExternal(managedExternal) {
        this.managedExternals.push(managedExternal);
        return this.onExternalChange(managedExternal.name, managedExternal.external);
    }
    updateManagedExternal(managedExternal, newExternal) {
        if (managedExternal.external.equals(newExternal))
            return null;
        managedExternal.external = newExternal;
        return this.onExternalChange(managedExternal.name, managedExternal.external);
    }
    removeManagedExternal(managedExternal) {
        this.managedExternals = this.managedExternals.filter(ext => ext.external !== managedExternal.external);
        return this.onExternalRemoved(managedExternal.name, managedExternal.external);
    }
    initRequester() {
        const { cluster } = this;
        const druidRequestDecorator = this.createDruidRequestDecorator();
        return requester_1.properRequesterFactory({
            cluster,
            verbose: this.verbose,
            concurrentLimit: 5,
            druidRequestDecorator
        });
    }
    clusterAuthHeaders() {
        const { auth } = this.cluster;
        if (general_1.isNil(auth))
            return undefined;
        switch (auth.type) {
            case "http-basic": {
                const credentials = `${auth.username}:${auth.password}`;
                const Authorization = `Basic ${Buffer.from(credentials).toString("base64")}`;
                return { Authorization };
            }
        }
    }
    createDruidRequestDecorator() {
        const requestDecorator = this.loadRequestDecoratorModule();
        const authHeaders = this.clusterAuthHeaders();
        if (general_1.isNil(requestDecorator)) {
            if (general_1.isNil(authHeaders)) {
                return undefined;
            }
            else {
                return functional_1.constant({ headers: authHeaders });
            }
        }
        if (general_1.isNil(authHeaders))
            return requestDecorator;
        return (request, context) => {
            const decoration = requestDecorator(request, context);
            return Promise.resolve(decoration).then(d => Object.assign(d, authHeaders));
        };
    }
    loadRequestDecoratorModule() {
        const { cluster, logger, anchorPath } = this;
        if (!cluster.requestDecorator)
            return undefined;
        try {
            logger.log(`Cluster ${cluster.name}: Loading requestDecorator`);
            const module = module_loader_1.loadModule(cluster.requestDecorator.path, anchorPath);
            if (module.version !== DRUID_REQUEST_DECORATOR_MODULE_VERSION) {
                logger.error(`Cluster ${cluster.name}: druidRequestDecorator module has incorrect version`);
                return undefined;
            }
            logger.log(`Cluster ${cluster.name} creating requestDecorator`);
            return module.druidRequestDecoratorFactory(logger.setLoggerId("DruidRequestDecoratorFactory"), {
                options: cluster.requestDecorator.options,
                cluster
            });
        }
        catch (e) {
            logger.error(`Cluster ${cluster.name}: Couldn't load druidRequestDecorator module: ${e.message}`);
            return undefined;
        }
    }
    updateSourceListRefreshTimer() {
        const { logger, cluster } = this;
        if (this.sourceListRefreshInterval !== cluster.sourceListRefreshInterval) {
            this.sourceListRefreshInterval = cluster.sourceListRefreshInterval;
            if (this.sourceListRefreshTimer) {
                logger.log(`Clearing sourceListRefresh timer in cluster '${cluster.name}'`);
                clearInterval(this.sourceListRefreshTimer);
                this.sourceListRefreshTimer = null;
            }
            if (this.sourceListRefreshInterval && cluster_1.shouldScanSources(cluster)) {
                logger.log(`Setting up sourceListRefresh timer in cluster '${cluster.name}' (every ${this.sourceListRefreshInterval}ms)`);
                this.sourceListRefreshTimer = setInterval(() => {
                    this.scanSourceList().catch(e => {
                        logger.error(`Cluster '${cluster.name}' encountered and error during SourceListRefresh: ${e.message}`);
                    });
                }, this.sourceListRefreshInterval);
                this.sourceListRefreshTimer.unref();
            }
        }
    }
    updateSourceReintrospectTimer() {
        const { logger, cluster } = this;
        if (this.sourceReintrospectInterval !== cluster.sourceReintrospectInterval) {
            this.sourceReintrospectInterval = cluster.sourceReintrospectInterval;
            if (this.sourceReintrospectTimer) {
                logger.log(`Clearing sourceReintrospect timer in cluster '${cluster.name}'`);
                clearInterval(this.sourceReintrospectTimer);
                this.sourceReintrospectTimer = null;
            }
            if (this.sourceReintrospectInterval) {
                logger.log(`Setting up sourceReintrospect timer in cluster '${cluster.name}' (every ${this.sourceReintrospectInterval}ms)`);
                this.sourceReintrospectTimer = setInterval(() => {
                    this.introspectSources().catch(e => {
                        logger.error(`Cluster '${cluster.name}' encountered and error during SourceReintrospect: ${e.message}`);
                    });
                }, this.sourceReintrospectInterval);
                this.sourceReintrospectTimer.unref();
            }
        }
    }
    establishInitialConnection() {
        const { logger, verbose, cluster } = this;
        return new Promise(resolve => {
            let retryNumber = -1;
            let lastTryAt;
            const attemptConnection = () => {
                retryNumber++;
                if (retryNumber === 0) {
                    if (verbose)
                        logger.log(`Attempting to connect to cluster '${cluster.name}'`);
                }
                else {
                    logger.log(`Re-attempting to connect to cluster '${cluster.name}' (retry ${retryNumber})`);
                }
                lastTryAt = Date.now();
                plywood_1.External.getConstructorFor(cluster.type)
                    .getVersion(this.requester)
                    .then((version) => {
                    this.onConnectionEstablished();
                    this.internalizeVersion(version).then(() => resolve(null));
                }, (e) => {
                    const msSinceLastTry = Date.now() - lastTryAt;
                    const msToWait = Math.max(1, CONNECTION_RETRY_TIMEOUT - msSinceLastTry);
                    logger.error(`Failed to connect to cluster '${cluster.name}' because: ${e.message} (will retry in ${msToWait}ms)`);
                    this.initialConnectionTimer = setTimeout(attemptConnection, msToWait);
                });
            };
            attemptConnection();
        });
    }
    onConnectionEstablished() {
        const { logger, cluster } = this;
        logger.log(`Connected to cluster '${cluster.name}'`);
        this.initialConnectionEstablished = true;
        this.updateSourceListRefreshTimer();
        this.updateSourceReintrospectTimer();
    }
    internalizeVersion(version) {
        if (this.version)
            return Promise.resolve(null);
        const { logger, cluster } = this;
        logger.log(`Cluster '${cluster.name}' is running druid@${version}`);
        this.version = version;
        const tasks = this.managedExternals.map(managedExternal => {
            if (managedExternal.external.version)
                return Promise.resolve(null);
            return this.updateManagedExternal(managedExternal, managedExternal.external.changeVersion(version));
        });
        return Promise.all(tasks).then(functional_1.noop);
    }
    introspectManagedExternal(managedExternal) {
        const { logger, verbose, cluster } = this;
        if (managedExternal.suppressIntrospection)
            return Promise.resolve(null);
        if (verbose)
            logger.log(`Cluster '${cluster.name}' introspecting '${managedExternal.name}'`);
        return managedExternal.external.introspect()
            .then(introspectedExternal => {
            this.introspectedSources[String(introspectedExternal.source)] = true;
            return this.updateManagedExternal(managedExternal, introspectedExternal);
        }, (e) => {
            logger.error(`Cluster '${cluster.name}' could not introspect '${managedExternal.name}' because: ${e.message}`);
        });
    }
    refresh() {
        const { cluster, initialConnectionEstablished } = this;
        let process = Promise.resolve(null);
        if (!initialConnectionEstablished)
            return process;
        if (cluster.sourceReintrospectOnLoad) {
            process = process.then(() => this.introspectSources());
        }
        if (cluster.sourceListRefreshOnLoad) {
            process = process.then(() => this.scanSourceList());
        }
        return process;
    }
}
exports.ClusterManager = ClusterManager;
//# sourceMappingURL=cluster-manager.js.map