import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/SEO";
import AboutUs from "../components/AboutUs";

const AboutUsPage = () => (
  <Layout>
    <SEO
      title="About Us"
      description="Everything you need to know about Kochii."
    />
    <AboutUs />
  </Layout>
);

export default AboutUsPage;
