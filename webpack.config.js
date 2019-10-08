module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'addsearch-search-ui.min.js',
    library: 'AddSearchSearchUI',
    libraryTarget: 'global'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
