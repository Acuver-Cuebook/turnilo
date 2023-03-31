"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const general_1 = require("../../../common/utils/general/general");
class PluginSettings {
    constructor(name, path, settings = {}) {
        this.name = name;
        this.path = path;
        this.settings = settings;
    }
    static fromJS({ name, path, settings }) {
        if (general_1.isNil(name))
            throw new Error("Plugin must have a name");
        if (general_1.isNil(path))
            throw new Error("Plugin must have a path");
        return new PluginSettings(name, path, settings);
    }
    equals(other) {
        return other instanceof PluginSettings
            && this.name === other.name
            && this.path === other.path
            && plywood_1.dictEqual(this.settings, other.settings);
    }
    toJS() {
        return {
            settings: this.settings,
            name: this.name,
            path: this.path
        };
    }
    toJSON() {
        return this.toJS();
    }
    valueOf() {
        return {
            settings: this.settings,
            name: this.name,
            path: this.path
        };
    }
}
exports.PluginSettings = PluginSettings;
//# sourceMappingURL=plugin-settings.js.map