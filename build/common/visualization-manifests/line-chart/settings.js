"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const defaults = {
    groupSeries: false
};
const settingsFactory = immutable_1.Record(defaults);
const createSettings = (settings) => new (settingsFactory)(settings);
exports.settings = {
    converter: {
        print: (settings) => settings.toJS(),
        read: (input) => createSettings({ groupSeries: !!input.groupSeries })
    },
    defaults: createSettings({})
};
//# sourceMappingURL=settings.js.map