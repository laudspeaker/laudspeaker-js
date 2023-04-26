const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.ts',
  devtool: isProduction ? undefined : 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    clean: true,
    library: {
      name: 'laudspeakerjs',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    umdNamedDefine: true,
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: isProduction
    ? []
    : [
        new HtmlWebpackPlugin({
          template: './public/index.html',
        }),
      ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    alias: {
      '@laudspeaker/laudspeaker-js': path.resolve(__dirname, 'dist/index.js'),
    },
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
