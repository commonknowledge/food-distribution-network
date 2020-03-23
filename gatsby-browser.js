/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "@csstools/normalize.css"
import React from "react"
import { PageGlobal } from "./src/components/page"

export const wrapRootElement = ({ element }) => {
  return <PageGlobal>{element}</PageGlobal>
}

// Remove hover on mobile devices
// https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices
if (!hasTouch()) {
  document.body.className += " hasHover"
}

function hasTouch() {
  return (
    "ontouchstart" in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}
