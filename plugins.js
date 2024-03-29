const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  MiniCssExtractPlugin: new MiniCssExtractPlugin({
    filename: "[name].css"
  }),
  IndexPage: new HtmlWebpackPlugin({
    template: "src/index.html"
  }),
  CopyPlugin: new CopyPlugin([
    { from: "video", to: "", test: "/a_coruna_simple_*.mp4/" }
  ])
};
