"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_conversions_1 = require("../hash-conversions");
class ViewDefinitionHashEncoder2 {
    decodeUrlHash(urlHash, visualization) {
        const jsArray = hash_conversions_1.hashToArray(urlHash);
        if (!(8 <= jsArray.length && jsArray.length <= 11))
            return null;
        return {
            visualization,
            timezone: jsArray[0],
            filter: jsArray[1],
            splits: jsArray[2],
            multiMeasureMode: jsArray[3],
            singleMeasure: jsArray[4],
            selectedMeasures: jsArray[5],
            pinnedDimensions: jsArray[6],
            pinnedSort: jsArray[7],
            compare: jsArray[9] || null,
            highlight: jsArray[10] || null
        };
    }
    encodeUrlHash(definition) {
        const compressed = [
            definition.timezone,
            definition.filter,
            definition.splits,
            definition.multiMeasureMode,
            definition.singleMeasure,
            definition.selectedMeasures,
            definition.pinnedDimensions,
            definition.pinnedSort,
            null,
            definition.compare,
            definition.highlight
        ];
        return hash_conversions_1.arrayToHash(compressed);
    }
}
exports.ViewDefinitionHashEncoder2 = ViewDefinitionHashEncoder2;
//# sourceMappingURL=view-definition-hash-encoder2.js.map