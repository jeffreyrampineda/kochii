import React from "react";

const ContactForm = () => {
  return (
    <form class="grey-text" action="/send" method="post">
      <div class="md-form form-sm">
        {" "}
        <i class="fas fa-user prefix"></i>
        <input
          type="text"
          name="from_name"
          id="name"
          class="form-control form-control-sm"
          placeholder="Name"
        />
      </div>
      <div class="md-form form-sm">
        {" "}
        <i class="fas fa-envelope prefix"></i>
        <input
          type="text"
          name="from_email"
          id="email"
          class="form-control form-control-sm"
          placeholder="Email"
        />
      </div>
      <div class="md-form form-sm">
        {" "}
        <i class="fas fa-pencil-alt prefix"></i>
        <textarea
          type="text"
          name="body"
          id="body"
          class="md-textarea form-control form-control-sm"
          rows="10"
          style={{ resize: "none" }}
          placeholder="Message"
        ></textarea>
      </div>
      <div class="text-center mt-4">
        <button
          type="submit"
          class="btn blue-gradient"
          style={{ borderRadius: "10em" }}
        >
          Send<i class="far fa-paper-planeml-1"></i>
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
