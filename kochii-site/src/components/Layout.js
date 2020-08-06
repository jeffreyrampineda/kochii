import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import Navbar from "./Navbar";
import Footer from "./Footer";
import '../styles/index.scss';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Navbar siteTitle={data.site.siteMetadata.title} />
      {children}
      <Footer siteTitle={data.site.siteMetadata.title} />
    </>
  )
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout;
