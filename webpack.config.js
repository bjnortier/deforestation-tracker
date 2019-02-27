const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const opn = require('opn')

const port = 7333

module.exports = {
  mode: 'development',
  entry: {
    'index': [
      `webpack-dev-server/client?http://localhost:${port}`,
      'webpack/hot/dev-server',
      path.resolve(__dirname, 'src', 'app', 'index')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'bundles'),
    filename: '[name].bundle.js',
    publicPath: 'bundles/'
  },
  devServer: {
    port,
    after: (app, server) => {
      opn(`http://localhost:${port}/`, { app: 'google chrome' })
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin(['MAPBOX_TOKEN'])
  ],
  resolve: {
    modules: [path.resolve('..', '..', 'node_modules'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        include: [
          fs.realpathSync(path.resolve(__dirname, 'src'))
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: ['url-loader']
      }
    ]
  }
}
