"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const general_1 = require("../../utils/general/general");
const dimension_1 = require("../dimension/dimension");
const dimensions_1 = require("../dimension/dimensions");
const filter_clause_1 = require("../filter-clause/filter-clause");
const filter_1 = require("../filter/filter");
const measures_1 = require("../measure/measures");
const query_decorator_1 = require("../query-decorator/query-decorator");
const refresh_rule_1 = require("../refresh-rule/refresh-rule");
const series_list_1 = require("../series-list/series-list");
const splits_1 = require("../splits/splits");
const queryable_data_cube_1 = require("./queryable-data-cube");
exports.DEFAULT_INTROSPECTION = "autofill-all";
const INTROSPECTION_VALUES = new Set(["none", "no-autofill", "autofill-dimensions-only", "autofill-measures-only", "autofill-all"]);
exports.DEFAULT_DEFAULT_TIMEZONE = new chronoshift_1.Timezone("Asia/Kolkata");
const DEFAULT_DEFAULT_FILTER = filter_1.EMPTY_FILTER;
const DEFAULT_DEFAULT_SPLITS = splits_1.EMPTY_SPLITS;
exports.DEFAULT_DEFAULT_DURATION = chronoshift_1.Duration.fromJS("P1D");
exports.DEFAULT_MAX_SPLITS = 3;
exports.DEFAULT_MAX_QUERIES = 500;
function checkDimensionsAndMeasuresNamesUniqueness(dimensions, measures, dataCubeName) {
    if (dimensions != null && measures != null) {
        const dimensionNames = Object.keys(dimensions.byName);
        const measureNames = Object.keys(measures.byName);
        const duplicateNames = immutable_1.List(measureNames)
            .concat(dimensionNames)
            .groupBy(name => name)
            .filter(names => names.count() > 1)
            .map((names, name) => name)
            .toList();
        if (duplicateNames.size > 0) {
            throw new Error(`data cube: '${dataCubeName}', names: ${general_1.quoteNames(duplicateNames)} found in both dimensions and measures'`);
        }
    }
}
function readDescription({ description, extendedDescription }) {
    if (!description) {
        return { description: "" };
    }
    if (extendedDescription) {
        return { description, extendedDescription };
    }
    const segments = description.split(/\n---\n/);
    if (segments.length === 0) {
        return { description };
    }
    return {
        description: segments[0],
        extendedDescription: segments.splice(1).join("\n---\n ")
    };
}
function readIntrospection(config) {
    const introspection = config.introspection || exports.DEFAULT_INTROSPECTION;
    if (!INTROSPECTION_VALUES.has(introspection)) {
        throw new Error(`invalid introspection value ${introspection}, must be one of ${[...INTROSPECTION_VALUES].join(", ")}`);
    }
    return introspection;
}
function readName(config) {
    const name = config.name;
    if (!name)
        throw new Error("DataCube must have a name");
    general_1.verifyUrlSafeName(name);
    return name;
}
function verifyCluster(config, cluster) {
    if (config.clusterName === "native")
        return;
    if (cluster === undefined) {
        throw new Error(`Could not find non-native cluster with name "${config.clusterName}" for data cube "${config.name}"`);
    }
    if (config.clusterName !== cluster.name) {
        throw new Error(`Cluster name '${config.clusterName}' was given but '${cluster.name}' cluster was supplied (must match)`);
    }
}
function readAttributes(config) {
    const attributeOverrides = plywood_1.AttributeInfo.fromJSs(config.attributeOverrides || []);
    const attributes = plywood_1.AttributeInfo.fromJSs(config.attributes || []);
    const derivedAttributes = config.derivedAttributes ? plywood_1.Expression.expressionLookupFromJS(config.derivedAttributes) : {};
    return {
        attributes,
        attributeOverrides,
        derivedAttributes
    };
}
function readTimeAttribute(config, cluster, dimensions, logger) {
    const isFromDruidCluster = config.clusterName !== "native" && cluster.type === "druid";
    if (isFromDruidCluster) {
        if (!general_1.isTruthy(config.timeAttribute)) {
            logger.warn(`DataCube "${config.name}" should have property timeAttribute. Setting timeAttribute to default value "__time"`);
        }
        if (general_1.isTruthy(config.timeAttribute) && config.timeAttribute !== "__time") {
            logger.warn(`timeAttribute in DataCube "${config.name}" should have value "__time" because it is required by Druid. Overriding timeAttribute to "__time"`);
        }
        const timeAttribute = plywood_1.$("__time");
        if (!general_1.isTruthy(dimensions_1.findDimensionByExpression(dimensions, timeAttribute))) {
            return {
                timeAttribute,
                dimensions: dimensions_1.prepend(dimension_1.timeDimension(timeAttribute), dimensions)
            };
        }
        else {
            return { timeAttribute, dimensions };
        }
    }
    else {
        if (!general_1.isTruthy(config.timeAttribute)) {
            throw new Error(`DataCube "${config.name}" must have defined timeAttribute property`);
        }
        const timeAttribute = plywood_1.$(config.timeAttribute);
        return {
            timeAttribute,
            dimensions
        };
    }
}
function readDimensions(config) {
    return dimensions_1.fromConfig(config.dimensions || []);
}
function readColumns(config) {
    const name = config.name;
    try {
        const dimensions = readDimensions(config);
        const measures = measures_1.fromConfig(config.measures || []);
        checkDimensionsAndMeasuresNamesUniqueness(dimensions, measures, name);
        return {
            dimensions,
            measures
        };
    }
    catch (e) {
        throw new Error(`data cube: '${name}', ${e.message}`);
    }
}
function verifyDefaultSortMeasure(config, measures) {
    if (config.defaultSortMeasure) {
        if (!measures_1.hasMeasureWithName(measures, config.defaultSortMeasure)) {
            throw new Error(`Can not find defaultSortMeasure '${config.defaultSortMeasure}' in data cube '${config.name}'`);
        }
    }
}
function readDefaultFilter(config) {
    if (!config.defaultFilter)
        return undefined;
    try {
        return filter_1.Filter.fromJS(config.defaultFilter);
    }
    catch (_a) {
        throw new Error(`Incorrect format of default filter for ${config.name}. Ignoring field`);
    }
}
function fromConfig(config, cluster, logger) {
    const name = readName(config);
    const introspection = readIntrospection(config);
    verifyCluster(config, cluster);
    const { attributes, attributeOverrides, derivedAttributes } = readAttributes(config);
    const refreshRule = config.refreshRule ? refresh_rule_1.RefreshRule.fromJS(config.refreshRule) : refresh_rule_1.RefreshRule.query();
    const { dimensions: initialDimensions, measures } = readColumns(config);
    const { timeAttribute, dimensions } = readTimeAttribute(config, cluster, initialDimensions, logger);
    verifyDefaultSortMeasure(config, measures);
    const subsetFormula = config.subsetFormula || config.subsetFilter;
    const defaultFilter = readDefaultFilter(config);
    const { description, extendedDescription } = readDescription(config);
    return {
        name,
        title: config.title || config.name,
        description,
        extendedDescription,
        clusterName: config.clusterName || "druid",
        source: config.source || config.name,
        group: config.group || null,
        subsetExpression: subsetFormula ? plywood_1.Expression.fromJSLoose(subsetFormula) : plywood_1.Expression.TRUE,
        rollup: Boolean(config.rollup),
        options: config.options || {},
        introspection,
        attributeOverrides,
        attributes,
        derivedAttributes,
        dimensions,
        measures,
        timeAttribute,
        defaultFilter,
        defaultTimezone: config.defaultTimezone ? chronoshift_1.Timezone.fromJS(config.defaultTimezone) : exports.DEFAULT_DEFAULT_TIMEZONE,
        defaultSplitDimensions: config.defaultSplitDimensions || [],
        defaultDuration: config.defaultDuration ? chronoshift_1.Duration.fromJS(config.defaultDuration) : exports.DEFAULT_DEFAULT_DURATION,
        defaultSortMeasure: getDefaultSortMeasure(config, measures),
        defaultSelectedMeasures: config.defaultSelectedMeasures || [],
        defaultPinnedDimensions: config.defaultPinnedDimensions || [],
        maxSplits: config.maxSplits || exports.DEFAULT_MAX_SPLITS,
        maxQueries: config.maxQueries || exports.DEFAULT_MAX_QUERIES,
        queryDecorator: config.queryDecorator ? query_decorator_1.QueryDecoratorDefinition.fromJS(config.queryDecorator) : null,
        refreshRule,
        cluster
    };
}
exports.fromConfig = fromConfig;
function serialize(dataCube) {
    const { attributes, clusterName, defaultDuration, defaultFilter, defaultPinnedDimensions, defaultSelectedMeasures, defaultSortMeasure, defaultSplitDimensions, defaultTimezone, description, dimensions, extendedDescription, group, maxSplits, measures, name, options, refreshRule, rollup, source, timeAttribute, title } = dataCube;
    return {
        attributes: attributes.map(a => a.toJS()),
        clusterName,
        defaultDuration: defaultDuration && defaultDuration.toJS(),
        defaultFilter: defaultFilter && defaultFilter.toJS(),
        defaultPinnedDimensions,
        defaultSelectedMeasures,
        defaultSortMeasure,
        defaultSplitDimensions,
        defaultTimezone: defaultTimezone.toJS(),
        description,
        dimensions: dimensions_1.serialize(dimensions),
        extendedDescription,
        group,
        maxSplits,
        measures: measures_1.serialize(measures),
        name,
        options,
        refreshRule: refreshRule.toJS(),
        rollup,
        source,
        timeAttribute: timeAttribute.name,
        title
    };
}
exports.serialize = serialize;
function fromClusterAndExternal(name, cluster, external, logger) {
    const dataCube = fromConfig({
        name,
        clusterName: cluster.name,
        source: String(external.source),
        refreshRule: refresh_rule_1.RefreshRule.query().toJS()
    }, cluster, logger);
    return queryable_data_cube_1.attachExternalExecutor(dataCube, external);
}
exports.fromClusterAndExternal = fromClusterAndExternal;
function getMaxTime({ name, refreshRule }, timekeeper) {
    if (refreshRule.isRealtime()) {
        return timekeeper.now();
    }
    else if (refreshRule.isFixed()) {
        return refreshRule.time;
    }
    else {
        return timekeeper.getTime(name);
    }
}
exports.getMaxTime = getMaxTime;
function getDimensionsByKind(dataCube, kind) {
    return dimensions_1.allDimensions(dataCube.dimensions).filter(d => d.kind === kind);
}
exports.getDimensionsByKind = getDimensionsByKind;
function isTimeAttribute(dataCube, ex) {
    return ex instanceof plywood_1.RefExpression && ex.name === dataCube.timeAttribute;
}
exports.isTimeAttribute = isTimeAttribute;
function getTimeDimension(dataCube) {
    const dimension = dimensions_1.findDimensionByExpression(dataCube.dimensions, plywood_1.$(dataCube.timeAttribute));
    if (dimension === null) {
        throw new Error(`Expected DataCube "${dataCube.name}" to have timeAttribute property defined with expression of existing dimension`);
    }
    return dimension;
}
exports.getTimeDimension = getTimeDimension;
function getTimeDimensionReference(dataCube) {
    return getTimeDimension(dataCube).name;
}
exports.getTimeDimensionReference = getTimeDimensionReference;
function getDefaultFilter(dataCube) {
    const filter = dataCube.defaultFilter || DEFAULT_DEFAULT_FILTER;
    if (!dataCube.timeAttribute)
        return filter;
    const timeDimensionReference = getTimeDimensionReference(dataCube);
    return filter.insertByIndex(0, new filter_clause_1.RelativeTimeFilterClause({
        period: filter_clause_1.TimeFilterPeriod.LATEST,
        duration: dataCube.defaultDuration,
        reference: timeDimensionReference
    }));
}
exports.getDefaultFilter = getDefaultFilter;
function getDefaultSplits(dataCube) {
    if (dataCube.defaultSplitDimensions) {
        const dimensions = dataCube.defaultSplitDimensions.map(name => dimensions_1.findDimensionByName(dataCube.dimensions, name));
        return splits_1.Splits.fromDimensions(dimensions);
    }
    return DEFAULT_DEFAULT_SPLITS;
}
exports.getDefaultSplits = getDefaultSplits;
function getDefaultSeries(dataCube) {
    if (dataCube.defaultSelectedMeasures) {
        return series_list_1.SeriesList.fromMeasures(dataCube.defaultSelectedMeasures.map(name => measures_1.findMeasureByName(dataCube.measures, name)));
    }
    const first4Measures = measures_1.allMeasures(dataCube.measures).slice(0, 4);
    return series_list_1.SeriesList.fromMeasures(first4Measures);
}
exports.getDefaultSeries = getDefaultSeries;
function getDefaultSortMeasure(dataCube, measures) {
    if (dataCube.defaultSortMeasure)
        return dataCube.defaultSortMeasure;
    const firstMeasure = measures_1.allMeasures(measures)[0];
    if (firstMeasure)
        return firstMeasure.name;
    return undefined;
}
exports.getDefaultSortMeasure = getDefaultSortMeasure;
//# sourceMappingURL=data-cube.js.map