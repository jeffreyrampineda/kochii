import React from "react";

const Message = ({ title = "", subtitle = "", description = "" }) => {
  return (
    <header>
      <div style={{ height: "100%" }}>
        <div class="container-fluid d-flex align-items-center justify-content-center h-100">
          <div class="row d-flex justify-content-center text-center">
            <div class="col-md-10">
              <h2 class="display-1 font-weight-bold">{title}</h2>
              <h1 class="display-4 font-weight-bold">{subtitle}</h1>
              <hr class="hr-light" />
              <h4 class="my-4">{description}</h4>
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
  );
};

export default Message;
