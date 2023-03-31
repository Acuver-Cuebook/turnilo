"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIGH_PRIORITY_ACTION = 4;
exports.NORMAL_PRIORITY_ACTION = 3;
class Resolve {
    constructor(score, state, adjustment, message, resolutions) {
        this.score = Math.max(1, Math.min(10, score));
        this.state = state;
        this.adjustment = adjustment;
        this.message = message;
        this.resolutions = resolutions;
    }
    static compare(r1, r2) {
        return r2.score - r1.score;
    }
    static automatic(score, adjustment) {
        return new Resolve(score, "automatic", adjustment, null, null);
    }
    static manual(score, message, resolutions) {
        return new Resolve(score, "manual", null, message, resolutions);
    }
    static ready(score) {
        return new Resolve(score, "ready", null, null, null);
    }
    toString() {
        return this.state;
    }
    valueOf() {
        return this.state;
    }
    isReady() {
        return this.state === "ready";
    }
    isAutomatic() {
        return this.state === "automatic";
    }
    isManual() {
        return this.state === "manual";
    }
}
exports.Resolve = Resolve;
Resolve.NEVER = new Resolve(-1, "never", null, null, null);
class VisualizationManifest {
    constructor(name, title, evaluateRules, visualizationSettings) {
        this.name = name;
        this.title = title;
        this.evaluateRules = evaluateRules;
        this.visualizationSettings = visualizationSettings;
    }
}
exports.VisualizationManifest = VisualizationManifest;
//# sourceMappingURL=visualization-manifest.js.map