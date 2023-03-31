"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3_dsv_1 = require("d3-dsv");
function parseCSV(text) {
    return d3_dsv_1.csvParse(text, d3_dsv_1.autoType);
}
exports.parseCSV = parseCSV;
function parseTSV(text) {
    return d3_dsv_1.tsvParse(text, d3_dsv_1.autoType);
}
exports.parseTSV = parseTSV;
function parseJSON(text) {
    text = text.trim();
    const firstChar = text[0];
    if (firstChar[0] === "[") {
        try {
            return JSON.parse(text);
        }
        catch (e) {
            throw new Error("could not parse");
        }
    }
    else if (firstChar[0] === "{") {
        return text.split(/\r?\n/).map((line, i) => {
            try {
                return JSON.parse(line);
            }
            catch (e) {
                throw new Error(`problem in line: ${i}: '${line}'`);
            }
        });
    }
    else {
        throw new Error(`Unsupported start, starts with '${firstChar[0]}'`);
    }
}
exports.parseJSON = parseJSON;
function parseData(text, type) {
    type = type.replace(".", "");
    switch (type) {
        case "csv":
        case "text/csv":
            return parseCSV(text);
        case "tsv":
        case "text/tsv":
        case "text/tab-separated-values":
            return parseTSV(text);
        case "json":
        case "application/json":
            return parseJSON(text);
        default:
            throw new Error(`Unsupported file type '${type}'`);
    }
}
exports.parseData = parseData;
//# sourceMappingURL=parser.js.map