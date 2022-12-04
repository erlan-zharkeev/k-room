const path = require('path');
const package = require('./package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const reportMode = process.env.npm_lifecycle_event === 'build-stat' ? 'server' : 'disabled'
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`)

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
    clean: true,
  },

  mode: process.env.NODE_ENV,
  devtool: isDev ? 'source-map' : false,

  devServer: {
    client: {
      logging: 'error'
    },
    allowedHosts: 'all',
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        headers: {
            "Connection": "keep-alive"
        },
        ws: false,
        changeOrigin: true,
        secure: false
      },
      {
        context: ['/app/'],
        target: 'http://localhost:3000',
        headers: {
            "Connection": "keep-alive"
        },
        changeOrigin: true,
        ws: false,
        secure: false
      }
    ],

    historyApiFallback: true,

    port: "3001",
    open: true,
    hot: true ,
    liveReload: true
  },

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
        exclude: /node_modules/,
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
        test: /\.(gif|png|jpe?g|svg|mp3)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: isDev,
              mozjpeg: {
                progressive: true,
                quality: 70,
              },
              pngquant: {
                quality: [0.35, 0.8],
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'common-types': path.resolve(__dirname, './../types')
    },
  },
  optimization: {
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
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: package.name,
      template: './public/index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new BundleAnalyzerPlugin({ analyzerMode: reportMode })
  ]
}

