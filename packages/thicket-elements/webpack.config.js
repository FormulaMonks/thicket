const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: path.join(__dirname, "src", "index.js"),
  externals: {
    react: true,
    "react-dom": true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["es2015", "react"]
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              insertAt: "top"
            }
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[local]--[hash:base64:5]"
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: "index.js",
    library: 'thicket-elements',
    libraryTarget: "umd",
    umdNamedDefine: true,
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js"]
  }
};
