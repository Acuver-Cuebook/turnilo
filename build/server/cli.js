"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const build_settings_1 = __importStar(require("./cli/build-settings"));
const introspect_cluster_1 = __importDefault(require("./cli/introspect-cluster"));
const load_config_file_1 = require("./cli/load-config-file");
const options_1 = require("./cli/options");
const run_turnilo_1 = __importDefault(require("./cli/run-turnilo"));
const utils_1 = require("./cli/utils");
const version_1 = require("./version");
let version;
try {
    version = version_1.readVersion();
}
catch (e) {
    commander_1.program.error(`Failed to read turnilo version. Error: ${e.message}`);
}
commander_1.program
    .name("turnilo")
    .description("Turnilo is a data exploration tool that connects to Druid database")
    .version(version, "--version");
commander_1.program
    .command("run-config")
    .description("Runs Turnilo using config file")
    .argument("<config-path>", "Path to config file")
    .addOption(options_1.portOption)
    .addOption(options_1.loggerOption)
    .addOption(options_1.serverRootOption)
    .addOption(options_1.serverHostOption)
    .addOption(options_1.usernameOption)
    .addOption(options_1.passwordOption)
    .addOption(options_1.verboseOption)
    .action((configPath, { username, password, loggerFormat, serverRoot, serverHost, port, verbose }) => {
    const anchorPath = path_1.default.dirname(configPath);
    const auth = utils_1.parseCredentials(username, password, "http-basic");
    const config = load_config_file_1.loadConfigFile(configPath, commander_1.program);
    const options = {
        loggerFormat,
        serverRoot,
        serverHost,
        verbose,
        port
    };
    run_turnilo_1.default(build_settings_1.default(config, options, auth), anchorPath, verbose, version, commander_1.program);
});
commander_1.program
    .command("run-examples")
    .description("Runs Turnilo with example datasets")
    .addOption(options_1.portOption)
    .addOption(options_1.loggerOption)
    .addOption(options_1.serverRootOption)
    .addOption(options_1.serverHostOption)
    .addOption(options_1.verboseOption)
    .action(({ port, verbose, loggerFormat, serverRoot, serverHost }) => {
    const configPath = path_1.default.join(__dirname, "../../config-examples.yaml");
    const anchorPath = path_1.default.dirname(configPath);
    const config = load_config_file_1.loadConfigFile(configPath, commander_1.program);
    const options = { port, verbose, serverHost, serverRoot, loggerFormat };
    run_turnilo_1.default(build_settings_1.default(config, options), anchorPath, verbose, version, commander_1.program);
});
commander_1.program
    .command("connect-druid")
    .description("Runs turnilo that connects to Druid cluster and introspects it for datasets")
    .argument("<druid-url>", "Url of Druid cluster")
    .addOption(options_1.portOption)
    .addOption(options_1.loggerOption)
    .addOption(options_1.serverRootOption)
    .addOption(options_1.serverHostOption)
    .addOption(options_1.verboseOption)
    .addOption(options_1.usernameOption)
    .addOption(options_1.passwordOption)
    .action((url, { port, verbose, username, password, serverRoot, serverHost, loggerFormat }) => {
    const auth = utils_1.parseCredentials(username, password, "http-basic");
    const options = { port, verbose, serverHost, serverRoot, loggerFormat };
    run_turnilo_1.default(build_settings_1.settingsForDruidConnection(url, options, auth), process.cwd(), verbose, version, commander_1.program);
});
commander_1.program
    .command("load-file")
    .description("Runs Turnilo and loads json file as a dataset")
    .argument("<file-path>", "Path to json file with data")
    .requiredOption("-t, --time-attribute <field-name>", "JSON field name with time column")
    .addOption(options_1.portOption)
    .addOption(options_1.loggerOption)
    .addOption(options_1.serverRootOption)
    .addOption(options_1.serverHostOption)
    .addOption(options_1.verboseOption)
    .action((file, { timeAttribute, port, verbose, serverHost, serverRoot, loggerFormat }) => {
    const options = {
        loggerFormat,
        serverRoot,
        serverHost,
        verbose,
        port
    };
    run_turnilo_1.default(build_settings_1.settingsForDatasetFile(file, timeAttribute, options), process.cwd(), verbose, version, commander_1.program);
});
commander_1.program
    .command("verify-config")
    .description("Runs verification of provided config file")
    .argument("<file-path>", "Path to config file to verify")
    .addOption(options_1.verboseOption)
    .action((file, { verbose }) => {
    try {
        const config = load_config_file_1.loadConfigFile(file, commander_1.program);
        build_settings_1.default(config, { verbose });
    }
    catch (e) {
        commander_1.program.error(`Config verification error: ${e.message}`);
    }
});
commander_1.program
    .command("introspect-druid")
    .description("Connects to Druid cluster and prints introspected data in config file format")
    .argument("<druid-url>", "Url of Druid cluster")
    .addOption(options_1.verboseOption)
    .addOption(options_1.usernameOption)
    .addOption(options_1.passwordOption)
    .action((url, { verbose, username, password }) => {
    const auth = utils_1.parseCredentials(username, password, "http-basic");
    introspect_cluster_1.default(build_settings_1.settingsForDruidConnection(url, { verbose }, auth), verbose, version).catch((e) => {
        commander_1.program.error(`There was an error generating a config: ${e.message}`);
    });
});
commander_1.program.parse();
//# sourceMappingURL=cli.js.map