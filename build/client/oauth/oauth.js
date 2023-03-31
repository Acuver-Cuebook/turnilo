"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const base64_arraybuffer_1 = require("base64-arraybuffer");
const querystring_1 = require("querystring");
const randomstring_1 = require("randomstring");
const oauth_1 = require("../../common/models/oauth/oauth");
const local_storage_1 = require("../utils/local-storage/local-storage");
const TOKEN_KEY = "turnilo-oauth-access-token";
const URL_KEY = "turnilo-oauth-redirect-url";
const VERIFIER_KEY = "turnilo-oauth-code-verifier";
exports.getToken = () => local_storage_1.get(TOKEN_KEY);
exports.resetToken = () => local_storage_1.remove(TOKEN_KEY);
const saveToken = (token) => local_storage_1.set(TOKEN_KEY, token);
const getUrl = () => local_storage_1.get(URL_KEY);
const resetUrl = () => local_storage_1.remove(URL_KEY);
const saveUrl = (url) => local_storage_1.set(URL_KEY, url);
const getVerifier = () => local_storage_1.get(VERIFIER_KEY);
const resetVerifier = () => local_storage_1.remove(VERIFIER_KEY);
const saveVerifier = (codeVerifier) => local_storage_1.set(VERIFIER_KEY, codeVerifier);
exports.getCode = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
};
exports.hasCode = () => exports.getCode() !== null;
class OauthError extends Error {
    constructor() {
        super(...arguments);
        this.isOauthError = true;
    }
}
exports.OauthError = OauthError;
class OauthAuthenticationError extends OauthError {
}
class OauthAuthorizationError extends OauthError {
}
exports.isOauthError = (error) => error.hasOwnProperty("isOauthError");
function mapOauthError(oauth, error) {
    if (oauth_1.isEnabled(oauth) && !!error.response) {
        const { response: { status } } = error;
        if (status === 401)
            return new OauthAuthenticationError(error.message);
        if (status === 403)
            return new OauthAuthorizationError(error.message);
    }
    return error;
}
exports.mapOauthError = mapOauthError;
function exchangeCodeForToken(code, oauth) {
    const codeVerifier = getVerifier();
    return axios_1.default.post(oauth.tokenEndpoint, querystring_1.stringify({
        client_id: oauth.clientId,
        code,
        redirect_uri: oauth.redirectUri,
        grant_type: "authorization_code",
        code_verifier: codeVerifier
    }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(response => {
        resetVerifier();
        saveToken(String(response.data["access_token"]));
    });
}
exports.exchangeCodeForToken = exchangeCodeForToken;
function redirectToSavedUrl() {
    const url = getUrl();
    resetUrl();
    window.location.href = url;
}
exports.redirectToSavedUrl = redirectToSavedUrl;
function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    return window.crypto.subtle.digest("SHA-256", data).then(digest => {
        const base64Digest = base64_arraybuffer_1.encode(digest);
        return base64Digest
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
    });
}
function getCodeChallenge() {
    const codeVerifier = randomstring_1.generate(128);
    saveVerifier(codeVerifier);
    return generateCodeChallenge(codeVerifier);
}
function login(oauth) {
    function redirectToAuthorization(codeChallenge) {
        saveUrl(window.location.href);
        const queryParams = `?client_id=${oauth.clientId}&redirect_uri=${encodeURIComponent(oauth.redirectUri)}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}`;
        window.location.href = `${oauth.authorizationEndpoint}${queryParams}`;
    }
    getCodeChallenge().then(redirectToAuthorization);
}
exports.login = login;
//# sourceMappingURL=oauth.js.map