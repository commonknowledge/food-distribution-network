const fs = require("fs")
const { createProxyMiddleware } = require("http-proxy-middleware")
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Food Distribution Network`,
    description: `Food delivery and pickup opportunities, initialy in the area around Cooperation Kentish Town.`,
    author: `@cmmonknowledge`,
    siteUrl: `https://mutual-aid.co.uk`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/favicon.png`, // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-emotion",
    "gatsby-plugin-typescript",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-netlify-cache",
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: [`IBM+Plex+Mono:300,400`],
        display: "swap",
      },
    },
    `gatsby-plugin-favicon`,
    `gatsby-plugin-robots-txt`,
  ],
  developMiddleware: app => {
    app.use(
      "/.netlify/functions/",
      createProxyMiddleware({
        target: "http://localhost:9000",
        secure: false,
        pathRewrite: {
          "/.netlify/functions/": "",
        },
      })
    )
  },
}
