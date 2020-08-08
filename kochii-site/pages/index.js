import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Intro from "../components/Intro";

const IndexPage = () => (
  <Layout>
    <SEO
      title="Personal Inventory"
      description="Kochii assists and encourages individuals for a manageable meal preparation lifestyle."
    />
    <Intro />
  </Layout>
);

export default IndexPage;
