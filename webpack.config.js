const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  mode: "production",
  target: "node",
  entry: slsw.lib.entries,
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)|(\.test.ts)/,
        loader: "babel-loader",
      },
    ],
  },
};
