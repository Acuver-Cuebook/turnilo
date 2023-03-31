"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../utils/general/general");
function readClusterAuth(input) {
    if (general_1.isNil(input))
        return undefined;
    switch (input.type) {
        case "http-basic": {
            const { username, password } = input;
            if (general_1.isNil(username))
                throw new Error("ClusterAuth: username field is required for http-basic auth configuration");
            if (general_1.isNil(password))
                throw new Error("ClusterAuth: password field is required for http-basic auth configuration");
            return {
                type: "http-basic",
                password,
                username
            };
        }
        default: {
            throw new Error(`ClusterAuth: Unrecognized authorization type: ${input.type}`);
        }
    }
}
exports.readClusterAuth = readClusterAuth;
//# sourceMappingURL=cluster-auth.js.map