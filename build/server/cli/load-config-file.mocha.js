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
const FileModule = __importStar(require("../utils/file/file"));
const load_config_file_1 = require("./load-config-file");
describe("loadConfigFile", () => {
    it("should pass path and yml format to loadFileSync", () => {
        const loadFileSync = sinon.stub(FileModule, "loadFileSync").returns("result");
        load_config_file_1.loadConfigFile("path", null);
        chai_1.expect(loadFileSync.calledWith("path", "yaml")).to.be.true;
        loadFileSync.restore();
    });
    it("should call program.error with error message if loadFileSync throws", () => {
        const loadFileSync = sinon.stub(FileModule, "loadFileSync").throws(new Error("error-message"));
        const programSpy = { error: sinon.spy() };
        load_config_file_1.loadConfigFile("path", programSpy);
        chai_1.expect(programSpy.error.calledWithMatch("error-message")).to.be.true;
        loadFileSync.restore();
    });
});
//# sourceMappingURL=load-config-file.mocha.js.map