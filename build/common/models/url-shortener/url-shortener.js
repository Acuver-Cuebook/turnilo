"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fromConfig(definition) {
    return definition && Function("request", "url", "context", definition);
}
exports.fromConfig = fromConfig;
//# sourceMappingURL=url-shortener.js.map