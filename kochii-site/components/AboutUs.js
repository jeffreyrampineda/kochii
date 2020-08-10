import React from "react";
import ContactForm from "./ContactForm";

const AboutUs = (props) => {
  return (
    <React.Fragment>
      <div class="jumbotron blue-gradient">
        <div class="text-white text-center pt-5 px-4">
          <h1 class="display-4 font-weight-bold white-text pt-5 mb-2">
            About Us
          </h1>
          <h4 class="white-text my-4">
            Everything you need to know about Kochii
          </h4>
        </div>
      </div>
      <main class="mt-5">
        <div class="container mb-5">
          <div class="row">
            <div class="col-md-6 mb-4">
              <h2>Who created Kochii?</h2>
              <p>
                This is a personal open-source project created by{" "}
                <strong>Jeffrey Ram Pineda</strong> as a hobby. It is created
                with Angular as a frontend framework, Koa.js for the backend
                server, and MongoDB as its database.
              </p>
              <p>
                Have any questions? Got any suggestions? Fill the form on your
                right or use kochii's primary email{" "}
                <strong>contact@kochii.app</strong>
              </p>
              <h2>What is Kochii?</h2>
              <p>
                Knowing how to prepare your meals in advance will help you save
                money. Kochii is designed to keep track of busy people's cooking
                ingredients with the intention of assisting and promoting
                home-cooked meals.
              </p>
              <p>
                Through Kochii's upcoming recipe feature, cooking instructions
                can be archived for later use and will reveal to the user which
                recipes he/she can and cannot make in relation to his/her
                recorded inventory.
              </p>
            </div>
            <div class="col-md-6">
              <h2>Contact</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default AboutUs;
