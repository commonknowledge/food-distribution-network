import * as React from "react"
import { ThemeProvider } from "theme-ui"
import { Global, css } from "@emotion/core"
import { Fragment } from "react"
import { memoize, times } from "lodash"

const fib = memoize((x: number): number => (x === 0 ? x : x + fib(x - 1)))

export const theme = {
  fonts: {
    body: "'Neue Haas', system-ui, sans-serif",
    prose: "Times, 'Times New Roman', serif",
    heading: "'Neue Haas', system-ui, sans-serif",
    monospace: "'IBM Plex Mono', Menlo, monospace",
  },
  breakpoints: ["40em", "52em", "72em"],
  space: times(15, x => 2.5 * fib(x)),
  fontSizes: [8, 10, 14, 15, 18, 24, 32, 38, 54],
  lineHeights: {
    body: 1.45,
    heading: 1.125,
  },
  sizes: {
    container: 1300,
  },
  colors: {
    text: "#111",
    black: "#280000",
    accent: "#0032DD"
  },
  link: {
    default: {
      color: "inherit",
      textDecoration: "inherit",
      "body.hasHover &:hover": {
        opacity: 0.9,
      },
    },
    accent: {
      color: "accent",
      textDecoration: "inherit",
      "body.hasHover &:hover": {
        opacity: 0.9,
      },
    },
  },
  buttons: {
    transition: "all 250ms ease-in-out",
    primary: {
      background: "#FFFFFF",
      border: "2px solid #FC164B",
      color: "red",
      boxSizing: "border-box",
      borderRadius: 100,
      p: "0.5em 1em",
      fontSize: [20, null, 24],
      fontWeight: 500,
      fontFamily: "body",
      userSelect: "none",
      outline: "none",
      cursor: "pointer",
      "body.hasHover &:hover": {
        bg: 'redTint'
      },
    },
    filled: {
      color: 'white',
      bg: "accent",
      border: "none",
      boxSizing: "border-box",
      borderRadius: 100,
      p: "0.5em 1em",
      fontWeight: 500,
      fontFamily: "body",
      userSelect: "none",
      outline: "none",
      cursor: "pointer",
      "body.hasHover &:hover": {
        opacity: 0.8,
      },
    },
    outlined: {
      background: "rgba(0,0,0,0)",
      border: "2px solid white",
      boxSizing: "border-box",
      borderRadius: 100,
      p: "0.5em 1em",
      fontSize: [20, null, 24],
      fontWeight: 500,
      fontFamily: "body",
      userSelect: "none",
      outline: "none",
      cursor: "pointer",
      "body.hasHover &:hover": {
        opacity: 0.8,
      },
    },
  },
  forms: {
    heading: {
      variant: 'headings.3',
      marginBottom: '0.5em',
      '* + &': {
        marginTop: '1em'
      }
    },
    error: {
      color: 'red',
      fontWeight: 500,
      mt: '0.1em',
      mb: '0.1em'
    },
    label: {
      color: 'black',
      transition: "all 250ms ease-in-out",
      variant: 'headings.5',
      marginTop: '1.25em',
      marginBottom: 1,
      checkboxOption: {
        display: 'block',
        margin: 2,
        marginLeft: 0,
        marginRight: 0,
        cursor: 'pointer',
        fontWeight: '400 !important',
        fontSize: 'inherit !important',
        letterSpacing: 'initial',
        '&:hover input': {
          bg: 'redTint'
        },
        '&:active input': {
          bg: 'darkred',
          borderColor: 'darkred'
        }
      }
    },
    input: {
      color: "black",
      fontFamily: "body",
      fontSize: "inherit",
      px: 0,
      py: "0.5em",
      bg: "rgba(0,0,0,0)",
      transition: "border-color 250ms ease-in-out",
      borderRadius: 0,
      border: "none",
      borderBottom: theme => "2px solid " + theme.colors.black,
      "&:focus": {
        borderColor: "secondary",
        outline: "none",
      },
    },
    checkbox: {
      cursor: 'pointer',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      'vertical-align': 'middle',
      'font-size': '60px',
      'background': 'white',
      'border': '2px solid red',
      'width': '25px',
      'height': '25px',
      'border-radius': '20%',
      'display': 'inline-flex',
      'justify-content': 'center',
      'align-items': 'center',
      'flex-shrink': '0',
      'line-height': '1em',
      'margin-left': '0',
      'margin-right': '5px',
      'cursor': 'pointer',
      '&:disabled': {
        'opacity': '0.25',
        'cursor': 'not-allowed',
      },
      '&:checked:after': {
        'content': '""',
        display: 'block',
        bg: 'red',
        'border-radius': '20%',
        'transform': 'translate(0, 0)',
        'height': '70%',
        'width': '70%',
        'line-height': '0',
      }
    },
    radio: {
      cursor: 'pointer',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      'vertical-align': 'middle',
      'font-size': '60px',
      'background': 'white',
      'border': '2px solid red',
      'width': '25px',
      'height': '25px',
      'border-radius': '100%',
      'display': 'inline-flex',
      'justify-content': 'center',
      'align-items': 'center',
      'flex-shrink': '0',
      'line-height': '1em',
      'margin-left': '0',
      'margin-right': '5px',
      'cursor': 'pointer',
      '&:disabled': {
        'opacity': '0.25',
        'cursor': 'not-allowed',
      },
      '&:checked:after': {
        'content': '""',
        display: 'block',
        bg: 'red',
        'border-radius': '100%',
        'transform': 'translate(0, 0)',
        'height': '70%',
        'width': '70%',
        'line-height': '0',
      }
    }
  },
  headings: {
    display: {
      m: 0,
      fontWeight: 500,
      fontSize: [32, 54],
      lineHeight: "90%",
      letterSpacing: -0.5,
    },
    menu: {
      fontSize: 20,
      fontWeight: 500,
      lineHeight: "90%",
      textTransform: "uppercase",
    },
    meta: {
      fontSize: 20,
      fontWeight: 300,
      lineHeight: "90%",
      textTransform: "uppercase",
    },
    1: {
      fontWeight: 500,
      fontSize: [24, 54],
      lineHeight: ["110%", null, "90%"],
      letterSpacing: -0.5,
    },
    2: {
      fontWeight: 500,
      fontSize: [22, 32],
      letterSpacing: -0.25,
    },
    3: {
      fontWeight: 500,
      fontSize: [20, 24],
      lineHeight: "110%",
      letterSpacing: -0.3,
    },
    4: {
      fontWeight: 500,
      fontSize: [18, 22],
      lineHeight: "110%",
      letterSpacing: -0.3,
    },
    5: {
      fontWeight: 500,
      fontSize: [16, 20],
      lineHeight: "110%",
      letterSpacing: -0.3,
    }
  },
  styles: {
    a: {
      color: "primary",
      textDecoration: "none",
      borderBottom: theme => "1px solid " + theme.colors.accent,
      "body.hasHover &:hover": {
        color: "accent",
      },
    },
    blockquote: {
      fontStyle: "italic",
      ml: 0,
      pl: 4,
      color: "#767676",
      borderLeft: theme => "1px solid " + theme.colors.accent,
    },
    p: {
      lineHeight: "body",
      mb: "0.5em",
      mt: "0.5em",
    },
    h1: {},
    h2: { m: 0, fontWeight: 500, fontSize: 32, letterSpacing: "-0.25px" },
    h3: {
      m: 0,
    },
    h4: {},
  },
}

export const Theme: React.FC = ({ children }) => (
  <Fragment>
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          ${fontStack};
          html,
          body {
            -webkit-tap-highlight-color: transparent;
            margin: 0;
            padding: 0;
            min-height: 100%;
            background: ${theme.colors.background};
            font-family: ${theme.fonts.body};
            font-size: ${[theme.fontSizes[3]]}px;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            margin: 0;
          }
        `}
      />
      {children}
    </ThemeProvider>
  </Fragment>
)

const fontStack = `
/** Neue Haas Unica - main */

@font-face {
  font-family: "Neue Haas";
  src: url("/fonts/NeueHaasGrotesk/NHaasGroteskDSPro-35XLt.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: "Neue Haas";
  src: url("/fonts/NeueHaasGrotesk/NHaasGroteskDSPro-55Rg.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Neue Haas";
  src: url("/fonts/NeueHaasGrotesk/NHaasGroteskDSPro-65Md.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
}
`
