const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext) => (isDev ? `[name].${ext}` : `bundle.[name].${ext}`);

function optimization() {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimize = true;
    config.minimizer = [new TerserPlugin()];
  }

  return config;
}

module.exports = {
  context: path.resolve(__dirname, '#src'),
  mode: 'development',
  entry: ['@babel/polyfill', './js/index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, '#src/js'),
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : 'eval',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
};
