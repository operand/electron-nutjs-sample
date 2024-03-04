const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const main = {
  mode: 'development',
  entry: './main/index.ts',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [{ loader: 'ts-loader' }]
      },
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'electron-main.cjs'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

const preload = {
  mode: 'development',
  entry: './main/preload.ts',
  target: 'electron-preload',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [{ loader: 'ts-loader' }]
      },
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'electron-preload.cjs'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

const renderer = {
  mode: 'development',
  entry: './renderer/index.tsx',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'renderer'),
          path.resolve(__dirname, 'client'),
        ],
        use: [{ loader: 'ts-loader' }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'electron-renderer.[contenthash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'renderer/index.html'
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  devServer: {
    headers: {
      'Cache-Control': 'no-cache'
    },
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 8080,
  }
};

module.exports = (env) => {
  return [main, preload, renderer];
}
