const path = require('path');
const dotenv = require('dotenv')
const package = require('./package.json')
const webpack = require('webpack')
const CopyPlugin = require("copy-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { NODE_ENV, npm_lifecycle_event } = process.env

const ENV = dotenv.config({ path: `./_env/.env.${NODE_ENV}` }).parsed

const isDev = NODE_ENV === 'development'
const reportMode = npm_lifecycle_event === 'build-stat' ? 'server' : 'disabled'

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`)

module.exports = {
  mode: NODE_ENV,
  devtool: isDev ? 'source-map' : false,
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: filename('js'),
    clean: true,
    publicPath: '/'
  },
  devServer: {
    client: {
      logging: 'error'
    },
    allowedHosts: 'all',
    proxy: [
      {
        context: ['/api'],
        target: `http://localhost:${ENV.SERVER_PORT}`
      },
      {
        context: ['/app/'],
        target: `http://localhost:${ENV.SERVER_PORT}`
      }
    ],
    historyApiFallback: true,
    port: ENV.CLIENT_PORT,
    open: true,
    hot: true ,
    liveReload: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'common-types': path.resolve(__dirname, './../types')
    },
    fallback: {
      "fs": false,
      "os": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false
    }
  },
  optimization: {
    removeEmptyChunks: false,
    splitChunks: {
      chunks: 'all',
      minSize: 100000,
      maxSize: 250000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: package.name,
      template: './public/index.html',
      minify: {
        collapseWhitespace: !isDev,
      },
    }),
    new BundleAnalyzerPlugin({ analyzerMode: reportMode }),
    new webpack.DefinePlugin({
      SERVER_PORT: JSON.stringify(ENV.SERVER_PORT),
      HOST: JSON.stringify(ENV.HOST),
      IS_DEV: JSON.stringify(isDev),
      MAX_RECONNECT_ATTEMPTS: JSON.stringify(ENV.MAX_RECONNECT_ATTEMPTS)
    }),
    new CopyPlugin({
      patterns: [
        { from: "./public/meta", to: "./meta" },
        { from: "./public/additional-files", to: "./" },
        { from: "./public/sounds", to: "./sounds" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(gif|png|jpe?g|mp3)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      }
    ]
  }
}

