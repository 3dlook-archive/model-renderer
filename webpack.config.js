/* eslint-disable */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV;
const mode = (NODE_ENV && NODE_ENV.trim() === 'production') ? 'production' : 'development';

/**
 * Building paths
 */
const paths = {
  src: {
    js: path.resolve(`${__dirname}/index.js`),
  },
};

const plugins = [
  new webpack.ProvidePlugin({
		'THREE': 'three'
	}),
];

if (mode === 'development') {
  plugins.push(new HtmlWebpackPlugin({
    filename: 'demo.html',
    template: path.resolve('demo.html'),
    inject: false,
    minify: {
      removeComments: mode === 'production',
      collapseWhitespace: mode === 'production',
      removeAttributeQuotes: mode === 'production',
    },
  }));
}

/**
 * Webpack config
 */
const config = {
  mode,
  watch: mode === 'development',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
  entry: {
    'model-renderer': paths.src.js,
  },
  output: {
    path: `${__dirname}/dist/`,
    filename: '[name].js',
    library: 'ModelRenderer',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
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
                ['@babel/env', {
                  targets: {
                    browsers: ['last 2 versions', 'safari >= 7'],
                  },
                }],
              ],
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
    ]
  },
  resolve: {
    extensions: [ '.js' ],
    modules: [
      'node_modules'
    ],
  },
  plugins,
  devtool: (mode === 'production') ? false : 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: '0.0.0.0',
    port: 9000,
    historyApiFallback: true,
  },
};

module.exports = config;
