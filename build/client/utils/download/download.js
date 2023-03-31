"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileSaver = __importStar(require("file-saver"));
const tabular_options_1 = __importDefault(require("../tabular-options/tabular-options"));
function getMIMEType(fileType) {
    switch (fileType) {
        case "csv":
            return "text/csv";
        case "tsv":
            return "text/tsv";
    }
}
exports.getMIMEType = getMIMEType;
function saveFile(part, fileName, fileFormat, fileEncoding) {
    const type = `${getMIMEType(fileFormat)};charset=${fileEncoding}`;
    const blob = new Blob([part], { type });
    fileSaver.saveAs(blob, `${fileName}.${fileFormat}`, true);
}
function encodeContent(content, encoding) {
    if (encoding === "utf-8")
        return Promise.resolve(content);
    return Promise.resolve().then(() => __importStar(require("iconv-lite"))).then(iconv => iconv.encode(content, encoding));
}
function download(dataset, essence, fileFormat, fileName, fileEncoding) {
    const result = datasetToFileString(dataset, fileFormat, tabular_options_1.default(essence));
    encodeContent(result, fileEncoding).then(content => {
        saveFile(content, fileName, fileFormat, fileEncoding);
    });
}
exports.download = download;
function datasetToFileString(dataset, fileFormat, options) {
    switch (fileFormat) {
        case "csv":
            return dataset.toCSV(options);
        case "tsv":
            return dataset.toTSV(options);
    }
}
exports.datasetToFileString = datasetToFileString;
function fileNameBase(essence, timekeeper) {
    return essence.description(timekeeper);
}
exports.fileNameBase = fileNameBase;
//# sourceMappingURL=download.js.map