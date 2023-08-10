const { ProgressPlugin, EnvironmentPlugin } = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.tsx',
  devtool: isProduction ? undefined : 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    clean: true,
    library: '@laudspeaker/react-native',
    libraryTarget: 'umd',
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new ProgressPlugin(),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false,
    }),
    ...(isProduction
      ? []
      : [
          new HtmlWebpackPlugin({
            template: './public/index.html',
          }),
        ]),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: ['/node_modules/'],
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  externals: {
    react: 'react',
    '@react-native-async-storage/async-storage':
      '@react-native-async-storage/async-storage',
    'react-native': 'react-native',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    alias: {
      '@root': path.resolve(__dirname, 'src'),
      // '@laudspeaker/laudspeaker-js': path.resolve(__dirname, 'dist/index.js'),
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
