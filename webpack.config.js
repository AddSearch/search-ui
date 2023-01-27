const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const PACKAGE = require('./package.json');
const banner = PACKAGE.name + ' ' + PACKAGE.version;
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'addsearch-search-ui.min.js',
    library: 'AddSearchUI',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin({extractComments: false}), new OptimizeCssAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'addsearch-search-ui.min.css'
    }),
    new webpack.BannerPlugin({
      banner: banner
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {'targets': '> 0.1%, IE 10, not dead'}
              ]
            ]
          }
        }
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: {} },
          {
            loader: "postcss-loader",
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')({}),
              ]
            }
          },
          { loader: "sass-loader", options: {} }
        ],
      },

      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
        options: {
          precompileOptions: {
            knownHelpersOnly: false,
          },
        }
      }
    ]
  }
};
