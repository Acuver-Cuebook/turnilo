"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plywood_1 = require("plywood");
const react_1 = __importStar(require("react"));
const view_definitions_1 = require("../../../common/view-definitions");
const filter_definition_1 = require("../../../common/view-definitions/version-4/filter-definition");
const split_definition_1 = require("../../../common/view-definitions/version-4/split-definition");
const ajax_1 = require("../../utils/ajax/ajax");
class ApiContextIllegalAccessError extends Error {
    constructor() {
        super("Attempted to consume ApiContext when there was no Provider");
    }
}
exports.ApiContext = react_1.default.createContext({
    get numberFilterQuery() {
        throw new ApiContextIllegalAccessError();
    },
    get booleanFilterQuery() {
        throw new ApiContextIllegalAccessError();
    },
    get visualizationQuery() {
        throw new ApiContextIllegalAccessError();
    },
    get rawDataQuery() {
        throw new ApiContextIllegalAccessError();
    },
    get pinboardQuery() {
        throw new ApiContextIllegalAccessError();
    },
    get stringFilterQuery() {
        throw new ApiContextIllegalAccessError();
    }
});
function useApiContext() {
    return react_1.useContext(exports.ApiContext);
}
exports.useApiContext = useApiContext;
const emptyParams = () => ({});
function createApiCall(settings, query, serializeExtraParams) {
    const { oauth, clientTimeout: timeout } = settings;
    const converter = view_definitions_1.definitionConverters[view_definitions_1.DEFAULT_VIEW_DEFINITION_VERSION];
    return (essence, ...args) => {
        const extra = serializeExtraParams(...args);
        const { dataCube: { name } } = essence;
        const viewDefinition = converter.toViewDefinition(essence);
        return ajax_1.Ajax.query({
            method: "POST",
            url: `query/${query}`,
            timeout,
            data: {
                dataCube: name,
                viewDefinition,
                ...extra
            }
        }, oauth).then(constructDataset);
    };
}
const constructDataset = (res) => plywood_1.Dataset.fromJS(res.result);
function createVizQueryApi(settings) {
    return createApiCall(settings, "visualization", emptyParams);
}
function createNumberFilterQuery(settings) {
    return createApiCall(settings, "number-filter", (dimension) => ({ dimension: dimension.name }));
}
function createBooleanFilterQuery(settings) {
    return createApiCall(settings, "boolean-filter", (dimension) => ({ dimension: dimension.name }));
}
function createStringFilterQuery(settings) {
    return createApiCall(settings, "string-filter", (clause) => {
        const clauseJS = filter_definition_1.filterDefinitionConverter.fromFilterClause(clause);
        return ({ clause: clauseJS });
    });
}
function createPinboardQuery(settings) {
    return createApiCall(settings, "pinboard", (clause, split) => {
        const clauseJS = clause && filter_definition_1.filterDefinitionConverter.fromFilterClause(clause);
        const splitJS = split_definition_1.splitConverter.fromSplitCombine(split);
        return ({ clause: clauseJS, split: splitJS });
    });
}
function createRawDataQueryApi(settings) {
    return createApiCall(settings, "raw-data", emptyParams);
}
function createApi(settings) {
    return {
        pinboardQuery: createPinboardQuery(settings),
        numberFilterQuery: createNumberFilterQuery(settings),
        booleanFilterQuery: createBooleanFilterQuery(settings),
        visualizationQuery: createVizQueryApi(settings),
        rawDataQuery: createRawDataQueryApi(settings),
        stringFilterQuery: createStringFilterQuery(settings)
    };
}
exports.CreateApiContext = ({ children, appSettings }) => {
    const value = createApi(appSettings);
    return react_1.default.createElement(exports.ApiContext.Provider, { value: value }, children);
};
//# sourceMappingURL=api-context.js.map