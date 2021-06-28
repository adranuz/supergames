const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const pug = {
  test: /\.pug$/,
  use: ["html-loader", "pug-html-loader"],
};
const sass = {
  test: /\.(sa|sc|c)ss$/i,
  use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
};
const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  type: "asset",
  use: [
    {
      loader: ImageMinimizerPlugin.loader,
      options: {
        severityError: "warning", // Ignore errors on corrupted images
        minimizerOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
          ],
        },
      },
    },
  ],
};

const views = ["index", "profile", "search", "article"];
module.exports = {
  entry: "./src/app.js",

  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].bundle.js",
    assetModuleFilename: "static/[hash][ext][query]",
    clean: true,
  },

  plugins: [
    ...views.map(
      (view) =>
        new HtmlWebpackPlugin({
          template: `src/views/${view}.pug`,
          filename: `${view}.html`,
        })
    ),
    new MiniCssExtractPlugin({
      filename: "css/[name]-styles.css",
      chunkFilename: "[id].css",
    }),
  ],

  module: {
    rules: [pug, sass, images],
  },
};
