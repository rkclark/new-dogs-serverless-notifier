const slsw = require('serverless-webpack');
const path = require('path');

module.exports = {
  target: 'node',
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  node: false,
  optimization: {
    minimize: false,
  },
  resolve: {
    // We need canvas to be faked or it causes errors due to how it is dynamically imported by JSDOM
    modules: [path.resolve(__dirname, 'fakeModules'), 'node_modules'],
  },
  devtool: 'inline-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { targets: { node: '12' }, useBuiltIns: 'usage', corejs: 3 },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
};
