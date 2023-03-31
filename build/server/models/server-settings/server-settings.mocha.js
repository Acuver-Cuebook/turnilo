"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const immutable_class_tester_1 = require("immutable-class-tester");
const server_settings_1 = require("./server-settings");
describe("ServerSettings", () => {
    it.skip("is an immutable class", () => {
        immutable_class_tester_1.testImmutableClass(server_settings_1.ServerSettings, [
            {},
            {
                port: 9091
            },
            {
                port: 9091,
                trustProxy: "always"
            },
            {
                port: 9090,
                serverRoot: "/swivs",
                pageMustLoadTimeout: 900,
                iframe: "deny"
            },
            {
                port: 9091,
                serverRoot: "/swivs",
                pageMustLoadTimeout: 901
            },
            {
                port: 9091,
                serverHost: "10.20.30.40",
                serverRoot: "/swivs",
                readinessEndpoint: "/status/readiness",
                pageMustLoadTimeout: 901
            }
        ]);
    });
    describe("healthEndpoint backward compatibility", () => {
        it("should interpret healthEndpoint as readinessEndpoint", () => {
            const healthEndpoint = "/health";
            const settings = server_settings_1.ServerSettings.fromJS({ healthEndpoint });
            chai_1.expect(settings.readinessEndpoint).to.be.eq(healthEndpoint);
        });
    });
    describe("upgrades", () => {
        it("port", () => {
            chai_1.expect(server_settings_1.ServerSettings.fromJS({
                port: "9090",
                serverRoot: "/swivs",
                pageMustLoadTimeout: 900,
                iframe: "deny"
            }).port).to.equal(9090);
        });
    });
});
//# sourceMappingURL=server-settings.mocha.js.map