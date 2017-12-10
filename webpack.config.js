const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./lib/commonjs/index.js",
  output: {
    library: "CTFLWizard",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    filename: `cfl-webpack-wizard.${isProduction ? "min." : ""}js`
  }
};
