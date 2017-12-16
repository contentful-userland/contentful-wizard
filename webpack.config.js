const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const plugins = isProduction
  ? [
      new UglifyJsPlugin(),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      })
    ]
  : [];

module.exports = {
  entry: "./lib/commonjs/index.js",
  output: {
    library: "CTFLWizard",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    filename: `contentful-wizard.${isProduction ? "min." : ""}js`
  },
  plugins
};
