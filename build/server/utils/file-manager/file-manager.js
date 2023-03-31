"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fse = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const plywood_1 = require("plywood");
const functional_1 = require("../../../common/utils/functional/functional");
const parser_1 = require("../parser/parser");
function getFileData(filePath) {
    return fse.readFile(filePath, "utf-8")
        .then(fileData => {
        try {
            return parser_1.parseData(fileData, path.extname(filePath));
        }
        catch (e) {
            throw new Error(`could not parse '${filePath}': ${e.message}`);
        }
    })
        .then(fileJSON => {
        fileJSON.forEach((d) => {
            d["time"] = new Date(d["time"]);
        });
        return fileJSON;
    });
}
exports.getFileData = getFileData;
class FileManager {
    constructor(options) {
        this.logger = options.logger;
        this.verbose = Boolean(options.verbose);
        this.anchorPath = options.anchorPath;
        this.uri = options.uri;
        this.subsetExpression = options.subsetExpression;
        this.verbose = Boolean(options.verbose);
        this.onDatasetChange = options.onDatasetChange || functional_1.noop;
    }
    init() {
        const { logger, anchorPath, uri } = this;
        const filePath = path.resolve(anchorPath, uri);
        logger.log(`Loading file ${filePath}`);
        return getFileData(filePath)
            .then(rawData => {
            logger.log(`Loaded file ${filePath} (rows = ${rawData.length})`);
            let dataset = plywood_1.Dataset.fromJS(rawData).hide();
            if (this.subsetExpression) {
                dataset = dataset.filter(this.subsetExpression);
            }
            this.dataset = dataset;
            this.onDatasetChange(dataset);
        }, e => {
            logger.error(`Failed to load file ${filePath} because: ${e.message}`);
        });
    }
    destroy() {
    }
}
exports.FileManager = FileManager;
//# sourceMappingURL=file-manager.js.map