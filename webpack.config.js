const { resolve } = require("path");
const nodeExternals = require("webpack-node-externals");

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV must be either "development" or "production"!')
}

const serverConfig = {
  mode: process.env.NODE_ENV,
  entry: "./src/server/server.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
  },
  output: {
    filename: "server.js",
    path: resolve(__dirname, "dist"),
  },
  target: "node",
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
};

const clientConfig = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/client/src/index.js",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".scss"],
  },
  output: {
    filename: "app.js",
    path: resolve(__dirname, "public/js"),
  },
};

module.exports = [serverConfig, clientConfig];
