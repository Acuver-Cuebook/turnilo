"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajax_1 = require("../utils/ajax/ajax");
const cluster_1 = require("./cluster");
const data_cube_1 = require("./data-cube");
function deserialize(settings, appSettings) {
    const clusters = settings.clusters.map(cluster_1.deserialize);
    const dataCubes = settings.dataCubes.map((dataCube) => {
        const executor = ajax_1.Ajax.queryUrlExecutorFactory(dataCube.name, appSettings);
        return data_cube_1.deserialize(dataCube, executor);
    });
    return {
        clusters,
        dataCubes
    };
}
exports.deserialize = deserialize;
//# sourceMappingURL=sources.js.map