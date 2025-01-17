"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chronoshift_1 = require("chronoshift");
const plywood_1 = require("plywood");
const cluster_fixtures_1 = require("../cluster/cluster.fixtures");
const dimensions_1 = require("../dimension/dimensions");
const dimensions_fixtures_1 = require("../dimension/dimensions.fixtures");
const measures_1 = require("../measure/measures");
const measures_fixtures_1 = require("../measure/measures.fixtures");
const refresh_rule_1 = require("../refresh-rule/refresh-rule");
const data_cube_1 = require("./data-cube");
const executor = plywood_1.basicExecutorFactory({
    datasets: {
        wiki: plywood_1.Dataset.fromJS([]),
        twitter: plywood_1.Dataset.fromJS([])
    }
});
exports.wikiDataCube = {
    derivedAttributes: {},
    options: {},
    subsetExpression: plywood_1.Expression.TRUE,
    dimensions: dimensions_fixtures_1.DimensionsFixtures.wiki(),
    measures: measures_fixtures_1.MeasuresFixtures.wiki(),
    attributeOverrides: [],
    attributes: plywood_1.AttributeInfo.fromJSs([
        { name: "time", type: "TIME" },
        { name: "articleName", type: "STRING" },
        { name: "page", type: "STRING" },
        { name: "userChars", type: "SET/STRING" },
        { name: "count", type: "NUMBER", unsplitable: true, maker: { op: "count" } }
    ]),
    cluster: cluster_fixtures_1.ClusterFixtures.druidWikiCluster(),
    defaultDuration: chronoshift_1.Duration.fromJS("P3D"),
    defaultSplitDimensions: [],
    maxQueries: data_cube_1.DEFAULT_MAX_QUERIES,
    defaultPinnedDimensions: ["articleName"],
    defaultSelectedMeasures: ["count"],
    defaultSortMeasure: "count",
    defaultTimezone: chronoshift_1.Timezone.fromJS("Etc/UTC"),
    extendedDescription: "",
    group: "",
    maxSplits: 4,
    name: "wiki",
    refreshRule: refresh_rule_1.RefreshRule.fromJS({
        time: new Date("2016-04-30T12:39:51.350Z"),
        rule: "fixed"
    }),
    rollup: false,
    timeAttribute: plywood_1.$("time"),
    title: "Wiki",
    description: "Wiki full description something about articles and editors",
    clusterName: "druid-wiki",
    source: "wiki",
    introspection: "none"
};
function pickClientProperties(dc) {
    const { attributes, clusterName, defaultDuration, defaultFilter, defaultPinnedDimensions, defaultSelectedMeasures, defaultSortMeasure, defaultSplitDimensions, defaultTimezone, description, dimensions, extendedDescription, group, maxSplits, measures, name, options, refreshRule, rollup, source, timeAttribute, title } = dc;
    return {
        attributes,
        clusterName,
        defaultDuration,
        defaultFilter,
        defaultPinnedDimensions,
        defaultSelectedMeasures,
        defaultSortMeasure,
        defaultSplitDimensions,
        defaultTimezone,
        description,
        dimensions,
        extendedDescription,
        group,
        maxSplits,
        measures,
        name,
        options,
        refreshRule,
        rollup,
        source,
        timeAttribute: timeAttribute && timeAttribute.name,
        title
    };
}
exports.wikiClientDataCube = {
    ...pickClientProperties(exports.wikiDataCube),
    executor
};
exports.twitterDataCube = {
    defaultSplitDimensions: [],
    maxQueries: data_cube_1.DEFAULT_MAX_QUERIES,
    cluster: cluster_fixtures_1.ClusterFixtures.druidTwitterCluster(),
    defaultSelectedMeasures: [],
    attributeOverrides: [],
    attributes: [],
    derivedAttributes: {},
    maxSplits: data_cube_1.DEFAULT_MAX_SPLITS,
    options: {},
    rollup: false,
    subsetExpression: plywood_1.Expression.TRUE,
    name: "twitter",
    title: "Twitter",
    description: "Twitter full description should go here - tweets and followers",
    clusterName: "druid-twitter",
    source: "twitter",
    introspection: "none",
    dimensions: dimensions_fixtures_1.DimensionsFixtures.twitter(),
    measures: measures_fixtures_1.MeasuresFixtures.twitter(),
    timeAttribute: plywood_1.$("time"),
    defaultTimezone: chronoshift_1.Timezone.fromJS("Etc/UTC"),
    defaultDuration: chronoshift_1.Duration.fromJS("P3D"),
    defaultSortMeasure: "count",
    defaultPinnedDimensions: ["tweet"],
    refreshRule: refresh_rule_1.RefreshRule.fromJS({
        rule: "realtime"
    })
};
exports.twitterClientDataCube = {
    ...pickClientProperties(exports.twitterDataCube),
    executor
};
function customCube(title, description, extendedDescription = "") {
    return {
        clusterName: "druid-custom",
        source: "custom",
        introspection: "none",
        defaultSplitDimensions: [],
        maxQueries: data_cube_1.DEFAULT_MAX_QUERIES,
        dimensions: dimensions_1.fromConfig([]),
        measures: measures_1.fromConfig([]),
        timeAttribute: plywood_1.$("time"),
        defaultTimezone: chronoshift_1.Timezone.fromJS("Etc/UTC"),
        defaultDuration: chronoshift_1.Duration.fromJS("P3D"),
        maxSplits: 4,
        refreshRule: refresh_rule_1.RefreshRule.fromJS({
            rule: "realtime"
        }),
        name: "custom",
        attributeOverrides: [],
        attributes: [],
        defaultPinnedDimensions: [],
        defaultSelectedMeasures: [],
        derivedAttributes: {},
        description,
        extendedDescription,
        options: {},
        rollup: false,
        subsetExpression: plywood_1.Expression.TRUE,
        title
    };
}
exports.customCube = customCube;
function customClientCube(title, description, extendedDescription = "") {
    return {
        ...pickClientProperties(customCube(title, description, extendedDescription)),
        executor
    };
}
exports.customClientCube = customClientCube;
function customCubeWithGuard(name = "some-name", guardCubes = true) {
    return {
        clusterName: "druid-custom",
        cluster: cluster_fixtures_1.ClusterFixtures.druidTwitterClusterJSWithGuard(guardCubes),
        source: "custom",
        introspection: "none",
        defaultSplitDimensions: [],
        maxQueries: data_cube_1.DEFAULT_MAX_QUERIES,
        dimensions: dimensions_1.fromConfig([]),
        measures: measures_1.fromConfig([]),
        timeAttribute: plywood_1.$("time"),
        defaultTimezone: chronoshift_1.Timezone.fromJS("Etc/UTC"),
        defaultDuration: chronoshift_1.Duration.fromJS("P3D"),
        maxSplits: 4,
        refreshRule: refresh_rule_1.RefreshRule.fromJS({
            rule: "realtime"
        }),
        name,
        attributeOverrides: [],
        attributes: [],
        defaultPinnedDimensions: [],
        defaultSelectedMeasures: [],
        derivedAttributes: {},
        description: "",
        extendedDescription: "",
        options: {},
        rollup: false,
        subsetExpression: plywood_1.Expression.TRUE,
        title: "customDataCubeWithGuard"
    };
}
exports.customCubeWithGuard = customCubeWithGuard;
const SMALL_WIKI_DATA = [
    {
        time: new Date("2015-09-12T00:46:58Z"),
        channel: "en",
        cityName: null,
        comment: "added project",
        commentLength: 13,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 0,
        isAnonymous: false,
        isMinor: false,
        isNew: false,
        isRobot: false,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "Talk",
        page: "Talk:Oswald Tilghman",
        regionIsoCode: null,
        regionName: null,
        user: "GELongstreet",
        userChars: ["E", "G", "L", "N", "O", "R", "S", "T"],
        delta: 36,
        added: 36,
        deleted: 0,
        deltaByTen: 3.6
    },
    {
        time: new Date("2015-09-12T00:47:00Z"),
        channel: "ca",
        cityName: null,
        comment: "Robot inserta {{Commonscat}} que enllaça amb [[commons:category:Rallicula]]",
        commentLength: 75,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 0,
        isAnonymous: false,
        isMinor: true,
        isNew: false,
        isRobot: true,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "Main",
        page: "Rallicula",
        regionIsoCode: null,
        regionName: null,
        user: "PereBot",
        userChars: ["B", "E", "O", "P", "R", "T"],
        delta: 17,
        added: 17,
        deleted: 0,
        deltaByTen: 1.7
    },
    {
        time: new Date("2015-09-12T00:47:05Z"),
        channel: "en",
        cityName: "Auburn",
        comment: "/* Status of peremptory norms under international law */ fixed spelling of 'Wimbledon'",
        commentLength: 86,
        countryIsoCode: "AU",
        countryName: "Australia",
        deltaBucket100: 0,
        isAnonymous: true,
        isMinor: false,
        isNew: false,
        isRobot: false,
        isUnpatrolled: false,
        metroCode: "123",
        namespace: "Main",
        page: "Peremptory norm",
        regionIsoCode: "NSW",
        regionName: "New South Wales",
        user: "60.225.66.142",
        userChars: [".", "0", "1", "2", "4", "5", "6"],
        delta: 0,
        added: 0,
        deleted: 0,
        deltaByTen: 0
    },
    {
        time: new Date("2015-09-12T00:47:08Z"),
        channel: "vi",
        cityName: null,
        comment: "fix Lỗi CS1: ngày tháng",
        commentLength: 23,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 0,
        isAnonymous: false,
        isMinor: true,
        isNew: false,
        isRobot: true,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "Main",
        page: "Apamea abruzzorum",
        regionIsoCode: null,
        regionName: null,
        user: "Cheers!-bot",
        userChars: ["!", "-", "B", "C", "E", "H", "O", "R", "S", "T"],
        delta: 18,
        added: 18,
        deleted: 0,
        deltaByTen: 1.8
    },
    {
        time: new Date("2015-09-12T00:47:11Z"),
        channel: "vi",
        cityName: null,
        comment: "clean up using [[Project:AWB|AWB]]",
        commentLength: 34,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 0,
        isAnonymous: false,
        isMinor: false,
        isNew: false,
        isRobot: true,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "Main",
        page: "Atractus flammigerus",
        regionIsoCode: null,
        regionName: null,
        user: "ThitxongkhoiAWB",
        userChars: ["A", "B", "G", "H", "I", "K", "N", "O", "T", "W", "X"],
        delta: 18,
        added: 18,
        deleted: 0,
        deltaByTen: 1.8
    },
    {
        time: new Date("2015-09-12T00:47:13Z"),
        channel: "vi",
        cityName: null,
        comment: "clean up using [[Project:AWB|AWB]]",
        commentLength: 34,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 0,
        isAnonymous: false,
        isMinor: false,
        isNew: false,
        isRobot: true,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "Main",
        page: "Agama mossambica",
        regionIsoCode: null,
        regionName: null,
        user: "ThitxongkhoiAWB",
        userChars: ["A", "B", "G", "H", "I", "K", "N", "O", "T", "W", "X"],
        delta: 18,
        added: 18,
        deleted: 0,
        deltaByTen: 1.8
    },
    {
        time: new Date("2015-09-12T00:47:17Z"),
        channel: "ca",
        cityName: null,
        comment: "/* Imperi Austrohongarès */",
        commentLength: 27,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: -100,
        isAnonymous: false,
        isMinor: false,
        isNew: false,
        isRobot: false,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "Main",
        page: "Campanya dels Balcans (1914-1918)",
        regionIsoCode: null,
        regionName: null,
        user: "Jaumellecha",
        userChars: ["A", "C", "E", "H", "J", "L", "M", "U"],
        delta: -20,
        added: 0,
        deleted: 20,
        deltaByTen: -2
    },
    {
        time: new Date("2015-09-12T00:47:19Z"),
        channel: "en",
        cityName: null,
        comment: "adding comment on notability and possible COI",
        commentLength: 45,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 300,
        isAnonymous: false,
        isMinor: false,
        isNew: true,
        isRobot: false,
        isUnpatrolled: true,
        metroCode: null,
        namespace: "Talk",
        page: "Talk:Dani Ploeger",
        regionIsoCode: null,
        regionName: null,
        user: "New Media Theorist",
        userChars: [" ", "A", "D", "E", "H", "I", "M", "N", "O", "R", "S", "T", "W"],
        delta: 345,
        added: 345,
        deleted: 0,
        deltaByTen: 34.5
    },
    {
        time: new Date("2015-09-12T00:47:21Z"),
        channel: "en",
        cityName: null,
        comment: "Copying assessment table to wiki",
        commentLength: 32,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 100,
        isAnonymous: false,
        isMinor: false,
        isNew: false,
        isRobot: true,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "User",
        page: "User:WP 1.0 bot/Tables/Project/Pubs",
        regionIsoCode: null,
        regionName: null,
        user: "WP 1.0 bot",
        userChars: [" ", ".", "0", "1", "B", "O", "P", "T", "W"],
        delta: 121,
        added: 121,
        deleted: 0,
        deltaByTen: 12.1
    },
    {
        time: new Date("2015-09-12T00:47:25Z"),
        channel: "vi",
        cityName: null,
        comment: "clean up using [[Project:AWB|AWB]]",
        commentLength: 34,
        countryIsoCode: null,
        countryName: null,
        deltaBucket100: 0,
        isAnonymous: false,
        isMinor: false,
        isNew: false,
        isRobot: true,
        isUnpatrolled: false,
        metroCode: null,
        namespace: "Main",
        page: "Agama persimilis",
        regionIsoCode: null,
        regionName: null,
        user: "ThitxongkhoiAWB",
        userChars: ["A", "B", "G", "H", "I", "K", "N", "O", "T", "W", "X"],
        delta: 18,
        added: 18,
        deleted: 0,
        deltaByTen: 1.8
    }
];
exports.wikiCubeWithExecutor = {
    ...exports.wikiDataCube,
    executor: plywood_1.basicExecutorFactory({
        datasets: {
            main: plywood_1.Dataset.fromJS(SMALL_WIKI_DATA)
        }
    })
};
//# sourceMappingURL=data-cube.fixtures.js.map