"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const commander_1 = require("commander");
const utils_1 = require("./utils");
describe("CLI utils", () => {
    describe("parseInteger", () => {
        it("should parse valid integer", () => {
            chai_1.expect(utils_1.parseInteger("9090")).to.be.equal(9090);
        });
        it("should throw InvalidArgumentError on invalid integer", () => {
            chai_1.expect(() => utils_1.parseInteger("foobar")).to.throw(commander_1.InvalidArgumentError);
        });
        it("should throw with message on invalid integer", () => {
            chai_1.expect(() => utils_1.parseInteger("foobar")).to.throw("Must be an integer");
        });
    });
    describe("parseCredentials", () => {
        it("should pass undefined if both parameters are undefined", () => {
            chai_1.expect(utils_1.parseCredentials(undefined, undefined, "http-basic")).to.be.undefined;
        });
        it("should return ClusterAuth object with username, password and type", () => {
            chai_1.expect(utils_1.parseCredentials("foobar", "secret", "http-basic")).to.be.deep.equal({
                username: "foobar",
                password: "secret",
                type: "http-basic"
            });
        });
        it("should throw InvalidArgumentError on missing password", () => {
            chai_1.expect(() => utils_1.parseCredentials("foobar", undefined, "http-basic")).to.throw(commander_1.InvalidArgumentError);
        });
        it("should throw with message on missing password", () => {
            chai_1.expect(() => utils_1.parseCredentials("foobar", undefined, "http-basic")).to.throw("Expected password for username");
        });
        it("should throw InvalidArgumentError on missing username", () => {
            chai_1.expect(() => utils_1.parseCredentials(undefined, "secret", "http-basic")).to.throw(commander_1.InvalidArgumentError);
        });
        it("should throw with message on missing username", () => {
            chai_1.expect(() => utils_1.parseCredentials(undefined, "secret", "http-basic")).to.throw("Expected username for password");
        });
    });
});
//# sourceMappingURL=utils.mocha.js.map