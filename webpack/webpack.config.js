const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// declaracion de la ruta de los assets
const ASSET_PATH = process.env.ASSET_PATH || "/";

// utilidades para adicionar a la configuracion de webpack
const utils = require('./pages')


/**
 * La configuracion recibira una prop mediante variables de entorno,
 * que nos dira si esta en desarrollo o en produccion
 */
module.exports = (env) => {
  return {
    context: path.join(__dirname, "../src"),

    entry: path.join(__dirname, "../src/app.js"),

    output: {
      publicPath: ASSET_PATH,
      path: path.resolve(__dirname, "../dist"),
      filename: "assets/scripts/[name].bundle.js",
      // assetModuleFilename: "assets/images/[hash][ext][query]",
    },

    devServer: {
      contentBase: path.join(__dirname, "../src"),
      compress: true,
      open: true,
    },
    
    target: 'web',

    resolve: {
      extensions: [".js"],
      alias: {
        images: path.resolve(__dirname, '../src/assets/images/'),
      }
    },

    plugins: [
      new webpack.ProgressPlugin(),
      new CopyWebpackPlugin({
        patterns: [{ from: "assets/images", to: "assets/images" }],
      }),
      new MiniCssExtractPlugin({
        filename: "assets/css/[name]-styles.css",
        chunkFilename: "[id].css",
      }),
      new HtmlWebpackPlugin({
        minify: !env === 'development',
        filename: 'index.html',
        template: 'views/index.pug',
        inject: true
      }),
      
      // env, public path, parent folder
      ...utils.pages(env), 
      //si hubiera una carpeta con distintos blogs
      // ...utils.pages(env, 'blog'),

      new WebpackNotifierPlugin({
        title: 'Your project'
      })
    ],

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            env === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.pug$/,
          use: ["pug-loader"],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          type: 'asset/resourse',
        }
      ],
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({ parallel: true }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            filename: 'assets/js/vendor.[chunkhash:7].bundle.js',
            // sync + async chunks
            chunks: 'all',
            // import file path containing node_modules
            test: /node_modules/,
          }
        },
      }
    }
  };
};
