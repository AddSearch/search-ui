const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');
const PACKAGE = require('./package.json');
const banner = PACKAGE.name + ' ' + PACKAGE.version;

module.exports = (env) => {

  return {
    entry: './index.js',
    output: {
      filename: 'addsearch-search-ui.min.js',
      library: 'AddSearchUI',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserJSPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: /addsearch-search-ui/i,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'addsearch-search-ui.min.css'
      }),
      new webpack.BannerPlugin({
        banner: banner
      })
    ],
    resolve: {
      alias: {
        handlebars$: 'handlebars/dist/handlebars.min.js'
      }
    },
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
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')({
                      'overrideBrowserslist': ['> 0.1%', 'last 2 versions']
                    }),
                  ]
                }
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
  }
}
