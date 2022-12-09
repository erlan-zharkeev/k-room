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
  },
  externals: [ nodeExternals() ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  }
}