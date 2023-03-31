"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_conversions_1 = require("../hash-conversions");
class ViewDefinitionHashEncoder3 {
    decodeUrlHash(urlHash, visualization) {
        return hash_conversions_1.hashToObject(urlHash);
    }
    encodeUrlHash(definition) {
        return hash_conversions_1.objectToHash(definition);
    }
}
exports.ViewDefinitionHashEncoder3 = ViewDefinitionHashEncoder3;
//# sourceMappingURL=view-definition-hash-encoder3.js.map