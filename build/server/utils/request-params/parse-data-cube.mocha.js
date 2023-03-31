"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = __importStar(require("sinon"));
const data_cube_fixtures_1 = require("../../../common/models/data-cube/data-cube.fixtures");
const DataCubeGuardModule = __importStar(require("../datacube-guard/datacube-guard"));
const parse_data_cube_1 = require("./parse-data-cube");
const RESTRICTED_PATHS = [
    "/plywood",
    "/query/visualization",
    "/query/raw-data"
];
const NON_RESTRICTED_PATHS = [
    "/mkurl"
];
const settings = ({
    getSources: () => Promise.resolve({
        clusters: [data_cube_fixtures_1.wikiCubeWithExecutor.cluster],
        dataCubes: [data_cube_fixtures_1.wikiCubeWithExecutor]
    })
});
describe("parseDataCube", () => {
    describe("verifyAccess", () => {
        let checkAccess;
        beforeEach(() => {
            checkAccess = sinon.stub(DataCubeGuardModule, "checkAccess").returns(true);
        });
        afterEach(() => {
            checkAccess.restore();
        });
        const mockRequest = (path, dataCube) => {
            return {
                path,
                body: {
                    dataCube
                },
                headers: "headers"
            };
        };
        describe("with guard = true", () => {
            RESTRICTED_PATHS.forEach(path => {
                it(`should call checkAccess on ${path} path`, async () => {
                    const req = mockRequest(path, "wiki");
                    await parse_data_cube_1.parseDataCube(req, settings);
                    chai_1.expect(checkAccess.calledWith(data_cube_fixtures_1.wikiCubeWithExecutor, "headers")).to.be.true;
                });
            });
            NON_RESTRICTED_PATHS.forEach(path => {
                it(`should not call checkAccess on ${path} and return cube`, async () => {
                    const req = mockRequest(path, "wiki");
                    const dataCube = await parse_data_cube_1.parseDataCube(req, settings);
                    chai_1.expect(dataCube).to.be.deep.equal(data_cube_fixtures_1.wikiCubeWithExecutor);
                    chai_1.expect(checkAccess.called).to.be.false;
                });
            });
        });
    });
});
//# sourceMappingURL=parse-data-cube.mocha.js.map