import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/index.scss";

const Layout = ({ children }) => {
  const siteTitle = "Kochii";

  return (
    <>
      <Navbar siteTitle={siteTitle} />
      {children}
      <Footer siteTitle={siteTitle} />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
