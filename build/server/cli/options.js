"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const server_settings_1 = require("../models/server-settings/server-settings");
const utils_1 = require("./utils");
exports.portOption = new commander_1.Option("-p, --port <number>", `Port number to start server on. Default: ${server_settings_1.DEFAULT_PORT}`).argParser(utils_1.parseInteger);
exports.loggerOption = new commander_1.Option("--logger-format <format>", `Format for logger. Default: ${server_settings_1.DEFAULT_LOGGER_FORMAT}`).choices(server_settings_1.LOGGER_FORMAT_VALUES);
exports.serverRootOption = new commander_1.Option("--server-root <path>", "Custom path to act as turnilo root");
exports.serverHostOption = new commander_1.Option("--server-host <hostname>", "Host that server will bind to");
exports.verboseOption = new commander_1.Option("--verbose", "Verbose mode");
exports.usernameOption = new commander_1.Option("--username <username>", "Username that will be used in HTTP Basic authentication to Druid cluster");
exports.passwordOption = new commander_1.Option("--password <password>", "Password that will be used in HTTP Basic authentication to Druid cluster");
//# sourceMappingURL=options.js.map