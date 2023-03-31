"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const plywood_1 = require("plywood");
const oauth_1 = require("../../../common/models/oauth/oauth");
const sources_1 = require("../../deserializers/sources");
const oauth_2 = require("../../oauth/oauth");
const validateStatus = (s) => 200 <= s && s < 300 || s === 304;
class Ajax {
    static headers(oauth) {
        if (!oauth_1.isEnabled(oauth))
            return {};
        const headerName = oauth.tokenHeaderName;
        const token = oauth_2.getToken();
        return !token ? {} : {
            [headerName]: oauth_2.getToken()
        };
    }
    static query({ data, url, timeout, method }, oauth) {
        if (data) {
            if (Ajax.version)
                data.version = Ajax.version;
            if (Ajax.settingsVersionGetter)
                data.settingsVersion = Ajax.settingsVersionGetter();
        }
        const headers = Ajax.headers(oauth);
        return axios_1.default({ method, url, data, timeout, validateStatus, headers })
            .then(res => {
            return res.data;
        })
            .catch(error => {
            throw oauth_2.mapOauthError(oauth, error);
        });
    }
    static queryUrlExecutorFactory(dataCubeName, { oauth, clientTimeout: timeout }) {
        return (ex, env = {}) => {
            const method = "POST";
            const url = "plywood";
            const timezone = env ? env.timezone : null;
            const data = { dataCube: dataCubeName, expression: ex.toJS(), timezone };
            return Ajax.query({ method, url, timeout, data }, oauth)
                .then(res => plywood_1.Dataset.fromJS(res.result));
        };
    }
    static sources(appSettings) {
        const headers = Ajax.headers(appSettings.oauth);
        return axios_1.default.get("sources", { headers })
            .then(resp => resp.data)
            .catch(error => {
            throw oauth_2.mapOauthError(appSettings.oauth, error);
        })
            .then(sourcesJS => sources_1.deserialize(sourcesJS, appSettings));
    }
}
exports.Ajax = Ajax;
//# sourceMappingURL=ajax.js.map