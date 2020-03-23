/** @jsx jsx */
import { jsx } from "theme-ui"
import { Theme } from "../components/theme"
import Helmet from 'react-helmet';
import SEO from "./seo"

export const PageGlobal: React.FC = ({ children }) => {
  return (
    <Theme>
      <Helmet>
        <SEO />
      </Helmet>
      {children}
    </Theme>
  )
}