const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

const CSSLoader = {
  test: /\.css$/,
  use: [
    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
    "css-loader",
    "postcss-loader"
  ]
};

const JSLoader = {
  test: /\.m?js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "babel-loader"
  }
};

module.exports = {
  CSSLoader,
  JSLoader
};
