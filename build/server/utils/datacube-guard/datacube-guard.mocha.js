"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const data_cube_fixtures_1 = require("../../../common/models/data-cube/data-cube.fixtures");
const datacube_guard_1 = require("./datacube-guard");
function mockHeaders(allowedDataCubes) {
    return { [datacube_guard_1.allowDataCubesHeaderName]: allowedDataCubes };
}
describe("Guard test", () => {
    it("Guard off -> header for cube A and accessing cube B", () => {
        const dataCubeB = data_cube_fixtures_1.customCubeWithGuard("cubeB", false);
        chai_1.expect(datacube_guard_1.checkAccess(dataCubeB, mockHeaders("cubeA"))).to.equal(true);
    });
    it("Guard off -> access to all dataCubes", () => {
        const dataCube = data_cube_fixtures_1.customCubeWithGuard(null, false);
        chai_1.expect(datacube_guard_1.checkAccess(dataCube, mockHeaders(""))).to.equal(true);
    });
    it("Guard on -> access denied", () => {
        chai_1.expect(datacube_guard_1.checkAccess(data_cube_fixtures_1.customCubeWithGuard(), mockHeaders(""))).to.equal(false);
    });
    it("Guard on -> access denied", () => {
        chai_1.expect(datacube_guard_1.checkAccess(data_cube_fixtures_1.customCubeWithGuard(), mockHeaders("some,name"))).to.equal(false);
    });
    it("Guard on -> access allowed: wildchar", () => {
        const dataCube = data_cube_fixtures_1.customCubeWithGuard();
        chai_1.expect(datacube_guard_1.checkAccess(dataCube, mockHeaders("*,some-other-name"))).to.equal(true);
    });
    it("Guard on -> access allowed: datacube allowed", () => {
        const dataCube = data_cube_fixtures_1.customCubeWithGuard();
        chai_1.expect(datacube_guard_1.checkAccess(dataCube, mockHeaders("some-name,some-other-name"))).to.equal(true);
    });
});
//# sourceMappingURL=datacube-guard.mocha.js.map