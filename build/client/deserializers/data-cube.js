"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const plywood_1 = require("plywood");
const dimensions_1 = require("../../common/models/dimension/dimensions");
const filter_1 = require("../../common/models/filter/filter");
const measures_1 = require("../../common/models/measure/measures");
const refresh_rule_1 = require("../../common/models/refresh-rule/refresh-rule");
const dimensions_2 = require("./dimensions");
const measures_2 = require("./measures");
function deserialize(dataCube, executor) {
    const { attributes, clusterName, defaultDuration, defaultFilter, defaultPinnedDimensions, defaultSelectedMeasures, defaultSortMeasure, defaultSplitDimensions, defaultTimezone, description, dimensions, extendedDescription, group, maxSplits, measures, name, options, refreshRule, rollup, source, timeAttribute, title } = dataCube;
    return {
        attributes: plywood_1.AttributeInfo.fromJSs(attributes),
        clusterName,
        defaultDuration: chronoshift_1.Duration.fromJS(defaultDuration),
        defaultFilter: defaultFilter && filter_1.Filter.fromJS(defaultFilter),
        defaultPinnedDimensions,
        defaultSelectedMeasures,
        defaultSortMeasure,
        defaultSplitDimensions,
        defaultTimezone: chronoshift_1.Timezone.fromJS(defaultTimezone),
        description,
        dimensions: dimensions_2.deserialize(dimensions),
        executor,
        extendedDescription,
        group,
        maxSplits,
        measures: measures_2.deserialize(measures),
        name,
        options,
        refreshRule: refresh_rule_1.RefreshRule.fromJS(refreshRule),
        rollup,
        source,
        timeAttribute,
        title
    };
}
exports.deserialize = deserialize;
function serialize(dataCube) {
    const { attributes, clusterName, defaultDuration, defaultFilter, defaultPinnedDimensions, defaultSelectedMeasures, defaultSortMeasure, defaultSplitDimensions, defaultTimezone, description, dimensions, extendedDescription, group, maxSplits, measures, name, options, refreshRule, rollup, source, timeAttribute, title } = dataCube;
    return {
        attributes: attributes.map(a => a.toJS()),
        clusterName,
        defaultDuration: defaultDuration.toJS(),
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
        refreshRule: refresh_rule_1.RefreshRule.fromJS(refreshRule),
        rollup,
        source,
        timeAttribute,
        title
    };
}
exports.serialize = serialize;
//# sourceMappingURL=data-cube.js.map