const withPlugins = require("next-compose-plugins");

// const withSass = require("@zeit/next-sass");
// const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
const path = require("path");

module.exports = withPlugins([ ], {
  webpack(config) {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  },

});
