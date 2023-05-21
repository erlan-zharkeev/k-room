const path = require('path');
const dotenv = require('dotenv')
const package = require('./package.json')
const webpack = require('webpack')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { NODE_ENV, npm_lifecycle_event } = process.env

const ENV = dotenv.config({ path: `./_env/.env.${NODE_ENV}` }).parsed

const isDev = NODE_ENV === 'development'
const reportMode = npm_lifecycle_event === 'stat:build' ? 'server' : 'disabled'

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`)

module.exports = {
  mode: NODE_ENV,
  devtool: isDev ? 'source-map' : false,
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
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
        context: ['/api/'],
        target: `http://localhost:${ENV.SERVER_PORT}`
      }
    ],
    historyApiFallback: true,
    port: ENV.CLIENT_PORT,
    open: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'common-types': path.resolve(__dirname, './../types'),
      'ui': path.resolve(__dirname, 'src/components/UI')
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
      maxSize: 200000,
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
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css'),
      chunkFilename: filename('css')
    }),
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
      MAX_RECONNECT_ATTEMPTS: JSON.stringify(ENV.MAX_RECONNECT_ATTEMPTS),
      GOOGLE_CLIENT_ID: JSON.stringify(ENV.GOOGLE_CLIENT_ID),
      FIREBASE_API_KEY: JSON.stringify(ENV.FIREBASE_API_KEY),
      FIREBASE_AUTH_DOMAIN: JSON.stringify(ENV.FIREBASE_AUTH_DOMAIN),
      FIREBASE_PROJECT_ID: JSON.stringify(ENV.FIREBASE_PROJECT_ID),
      FIREBASE_STORAGE_BUCKET: JSON.stringify(ENV.FIREBASE_STORAGE_BUCKET),
      FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(ENV.FIREBASE_MESSAGING_SENDER_ID),
      FIREBASE_APP_ID: JSON.stringify(ENV.FIREBASE_APP_ID),
      FIREBASE_MEASUREMENT_ID: JSON.stringify(ENV.FIREBASE_MEASUREMENT_ID)
    }),
    new CopyPlugin({
      patterns: [
        { from: "./public/meta", to: "./meta" },
        { from: "./public/additional-files", to: "./" },
        { from: "./public/sounds", to: "./sounds" }
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
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
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

