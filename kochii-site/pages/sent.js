import React from "react";
import Message from "../components/Message";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const AboutUsPage = () => (
  <Layout>
    <SEO
      title="Message sent"
      description="Your message was sent successfully."
    />
    <Message
      subtitle="Success"
      description="Your message was sent successfully"
    />
  </Layout>
);

export default AboutUsPage;
