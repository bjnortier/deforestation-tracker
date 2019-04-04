const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const opn = require('opn')

const port = 7333
const mode = process.env.NODE_ENV || 'development'

const config = {
  mode,
  entry: {
    'index': [path.resolve(__dirname, 'src', 'app', 'index')]
  },
  output: {
    path: path.resolve(__dirname, 'static', 'js'),
    filename: '[name].bundle.js',
    publicPath: '/static/js/'
  },
  devServer: {
    port,
    after: (app, server) => {
      opn(`http://localhost:${port}/`, { app: 'google chrome' })
    }
  },
  plugins: [
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
      },
      {
        test: /\.(geojson|json)$/i,
        use: ['json-loader']
      }
    ]
  }
}

if (mode === 'development') {
  config.entry.index.unshift('webpack/hot/dev-server')
  config.entry.index.unshift(`webpack-dev-server/client?http://localhost:${port}`)
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.devServer = {
    port,
    historyApiFallback: true,
    after: (app, server) => {
      opn(`http://localhost:${port}/`, { app: 'google chrome' })
    }
  }
}

module.exports = config
