"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fromViewDefinition(visualization, settings) {
    const { converter: { read }, defaults } = visualization.visualizationSettings;
    return settings ? read(settings) : defaults;
}
exports.fromViewDefinition = fromViewDefinition;
function toViewDefinition(visualization, settings) {
    const { converter: { print } } = visualization.visualizationSettings;
    return print(settings);
}
exports.toViewDefinition = toViewDefinition;
//# sourceMappingURL=visualization-settings-converter.js.map