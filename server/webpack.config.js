// Works only in production build

const path = require('path')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/app/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@features': path.resolve(__dirname, 'src/features'),
      app: path.resolve(__dirname, 'src/app'),
      features: path.resolve(__dirname, 'src/features'),
      entities: path.resolve(__dirname, 'src/entities'),
      'shared-config': path.resolve(__dirname, 'src/shared/config'),
      'shared-lib': path.resolve(__dirname, 'src/shared/lib'),
      'shared-middleware': path.resolve(__dirname, 'src/shared/middleware'),
      'common-types': path.resolve(__dirname, '../types')
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
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/assets', to: './assets', noErrorOnMissing: true }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  }
}
