"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
function createServer(serverSettings, app, logger, program) {
    const server = http_1.default.createServer(app);
    server.on("error", (error) => {
        if (error.syscall !== "listen") {
            throw error;
        }
        switch (error.code) {
            case "EACCES":
                program.error(`Port ${serverSettings.port} requires elevated privileges`);
                break;
            case "EADDRINUSE":
                program.error(`Port ${serverSettings.port} is already in use`);
                break;
            default:
                throw error;
        }
    });
    server.on("listening", () => {
        const address = server.address();
        logger.log(`Turnilo is listening on address ${address.address} port ${address.port}`);
    });
    app.set("port", serverSettings.port);
    server.listen(serverSettings.port, serverSettings.serverHost);
}
exports.default = createServer;
//# sourceMappingURL=create-server.js.map