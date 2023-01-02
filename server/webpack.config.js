const path = require('path')
const nodeExternals = require('webpack-node-externals')

const { NODE_ENV } = process.env

const isDev = NODE_ENV === 'development'

module.exports = {
  mode: NODE_ENV,
  entry: './src/index.ts',
  watch: isDev,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      'common-types': path.resolve(__dirname, './../types')
    }
  },
  externals: [nodeExternals()],
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
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader'
        ]
      }
    ]
  }
}
