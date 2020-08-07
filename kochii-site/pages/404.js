import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

const NotFoundPage = () => (
  <Layout>
    <SEO title="Page Not Found" description="Page Not Found" />
    <header>
      <div style={{ height: "100%" }}>
        <div class="container-fluid d-flex align-items-center justify-content-center h-100">
          <div class="row d-flex justify-content-center text-center">
            <div class="col-md-10">
              <h2 class="display-1 font-weight-bold">( ._.)</h2>
              <h1 class="display-4 font-weight-bold">404 Not Found</h1>
              <hr class="hr-light" />
              <h4 class="my-4">
                Sorry but you are lost, requested page not found!
              </h4>
              <a
                class="btn blue-gradient"
                href="/"
                style={{ borderRadius: "10em" }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  </Layout>
)

export default NotFoundPage
