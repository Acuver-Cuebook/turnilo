"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plywood_1 = require("plywood");
const queryable_data_cube_1 = require("../../../common/models/data-cube/queryable-data-cube");
const sources_1 = require("../../../common/models/sources/sources");
const outputFunctions = {
    json: (data) => JSON.stringify(data, null, 2),
    csv: (data) => data.toCSV(),
    tsv: (data) => data.toTSV()
};
function plyqlRouter(settings) {
    const router = express_1.Router();
    router.post("/", async (req, res) => {
        const { query } = req.body;
        let { outputType } = req.body;
        if (typeof query !== "string") {
            res.status(400).send("Query must be a string");
            return;
        }
        let parsedSQL;
        try {
            parsedSQL = plywood_1.Expression.parseSQL(query);
        }
        catch (e) {
            res.status(400).send(`Could not parse query as SQL: ${e.message}`);
            return;
        }
        if (typeof outputType !== "string") {
            outputType = "json";
        }
        const outputFn = outputFunctions[outputType];
        if (outputFn === undefined) {
            res.status(400).send("Invalid output type");
            return;
        }
        let parsedQuery = parsedSQL.expression;
        const dataCube = parsedSQL.table;
        if (!dataCube) {
            res.status(400).send("Could not determine data cube name");
            return;
        }
        parsedQuery = parsedQuery.substitute(ex => {
            if (ex instanceof plywood_1.RefExpression && ex.name === dataCube) {
                return plywood_1.$("main");
            }
            return null;
        });
        try {
            const sources = await settings.getSources();
            const myDataCube = sources_1.getDataCube(sources, dataCube);
            if (!myDataCube) {
                res.status(400).send({ error: "unknown data cube" });
                return;
            }
            if (!queryable_data_cube_1.isQueryable(myDataCube)) {
                res.status(400).send({ error: "un queryable data cube" });
                return;
            }
            const data = await myDataCube.executor(parsedQuery);
            res.type(outputType);
            res.send(outputFn(plywood_1.Dataset.fromJS(data.toJS())));
        }
        catch (error) {
            res.status(500).send(`got error ${error.message}`);
        }
    });
    return router;
}
exports.plyqlRouter = plyqlRouter;
//# sourceMappingURL=plyql.js.map