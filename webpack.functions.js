const Dotenv = require("dotenv-webpack")

// @see https://github.com/netlify/netlify-lambda#webpack-configuration
module.exports = {
  //   entry: ["./functions"],
  devtool: "inline-source-map",
  optimization: { minimize: false },
  plugins: [
    new Dotenv({
      path: require("path").resolve(__dirname, ".env.development"),
    }),
  ],
}
