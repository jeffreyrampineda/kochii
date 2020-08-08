import React from "react";
import Message from "../components/Message";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const NotFoundPage = () => (
  <Layout>
    <SEO title="Page Not Found" description="Page Not Found" />
    <Message
      title="( ._.)"
      subtitle="404 Not Found"
      description="Sorry but you are lost, requested page not found!"
    />
  </Layout>
);

export default NotFoundPage;
