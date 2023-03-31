"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const defaults = {
    showSummary: false
};
const createSettings = (settings) => new (immutable_1.Record(defaults))(settings);
exports.settings = {
    converter: {
        print: (settings) => settings.toJS(),
        read: (input) => createSettings({ showSummary: Boolean(input.showSummary) })
    },
    defaults: createSettings({})
};
//# sourceMappingURL=settings.js.map