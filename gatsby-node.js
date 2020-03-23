/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const webpackFixFs = require("./node/webpackFixFs").default

exports.onCreateWebpackConfig = args => {
  // required fix for package `qrcode.js`
  webpackFixFs(args)

  const config = {
    resolve: {
      modules: [require("path").resolve(__dirname, "src"), "node_modules"],
    },
  }

  // when building HTML, window is not defined, so Leaflet causes the build to blow up
  if (args.stage === "build-html") {
    config.module = {
      rules: [
        {
          test: /mapbox-gl/,
          use: args.loaders.null(),
        },
      ],
    }
  }

  args.actions.setWebpackConfig(config)
}
