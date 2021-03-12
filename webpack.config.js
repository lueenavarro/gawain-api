const path = require("path");

module.exports = {
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
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
