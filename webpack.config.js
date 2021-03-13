const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
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
