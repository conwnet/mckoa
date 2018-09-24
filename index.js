/**
 * @file 启用 babel
 * @author netcon
 */

require("@babel/register")({
    ignore: [/node_modules(?!\/mckoa)/],
    plugins: [
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-proposal-object-rest-spread",
        ["@babel/plugin-proposal-decorators", {legacy: true}],
        ["@babel/plugin-proposal-class-properties", {loose: true}],
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-throw-expressions"
    ]
});

module.exports = require('./entry');
