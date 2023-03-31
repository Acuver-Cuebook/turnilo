"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_settings_1 = require("../common/models/app-settings/app-settings");
function favicon(options) {
    const { version, title } = options;
    return `
<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png?v=${version}">
<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png?v=${version}">
<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png?v=${version}">
<link rel="manifest" href="favicon/site.webmanifest?v=${version}">
<link rel="mask-icon" href="favicon/safari-pinned-tab.svg?v=4" color="#ff5a00">
<link rel="shortcut icon" href="favicon/favicon.ico?v=${version}">
<meta name="apple-mobile-web-app-title" content="${title}">
<meta name="application-name" content="${title}">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="msapplication-config" content="favicon/browserconfig.xml?v=${version}">
<meta name="theme-color" content="#ffffff">
`;
}
function layout(options, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="description" content="Data Explorer">
  <meta name="author" content="Imply">
  <meta name="google" value="notranslate">
  ${favicon(options)}
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1">
  <title>${options.title}</title>
  <link rel="stylesheet" href="main.css?v=${options.version}">
</head>
<body>
${content}
</body>
</html>
`;
}
exports.layout = layout;
function mainLayout(options) {
    const { version, appSettings, timekeeper } = options;
    const cssVariables = appSettings.customization.cssVariables;
    const renderedCssVariables = Object.keys(cssVariables).map(name => `--${name}: ${cssVariables[name]};`).join("\n");
    const cssOverrides = `<style>
:root {
  ${renderedCssVariables}
}
</style>`;
    return layout(options, `<div class="app-container"></div>
<script>var __CONFIG__ = ${JSON.stringify({ version, timekeeper, appSettings: app_settings_1.serialize(appSettings) })};</script>
<script charset="UTF-8" nomodule src="polyfills.es5.js?v=${version}"></script>
<script charset="UTF-8" async src="dnd.es5.js?v=${version}"></script>
<script charset="UTF-8" async nomodule src="main.es5.js?v=${version}"></script>
<script charset="UTF-8" async type="module" src="main.js?v=${version}"></script>
${cssOverrides}`);
}
exports.mainLayout = mainLayout;
function errorLayout(options, message, error = {}) {
    const template = `<h1>${message}</h1>${error && `<h2>${error.status}</h2><pre>${error.stack}</pre>`}`;
    return layout(options, template);
}
exports.errorLayout = errorLayout;
//# sourceMappingURL=views.js.map