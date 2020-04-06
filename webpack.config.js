const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const loaders = require("./loaders");
const plugins = require("./plugins");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/js/index",
  output: {
    library: "VideoScroll",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: [
      path.join(__dirname, "./dist"),
      path.join(__dirname, "./video"),
      path.join(__dirname, "./data")
    ]
  },
  plugins: [
    plugins.MiniCssExtractPlugin,
    plugins.IndexPage,
    plugins.CopyPlugin
  ],
  module: {
    rules: [loaders.JSLoader, loaders.CSSLoader]
  }
};
