import path from 'path'
import nodeExternals from 'webpack-node-externals'

const serverConfig = {
  mode: process.env.NODE_ENV || 'production',
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   loader: 'ts-loader',
      //   exclude: /node_modules/,
      //   options: {
      //     configFile: 'tsconfig.server.json'
      //   }
      // }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',
  node: {
    __dirname: false
  },
  externals: [nodeExternals()]
}

const clientConfig = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/client/src/index.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   loader: 'ts-loader',
      //   exclude: 'node-modules',
      //   options: {
      //     configFile: 'tsconfig.client.json'
      //   }
      // },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss']
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public/js')
  }
}

export {
  serverConfig,
  clientConfig
}
