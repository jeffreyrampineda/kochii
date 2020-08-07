import { Link } from "gatsby"
import React from "react"

const Footer = ({ siteTitle }) => {
  return (
    <footer class="page-footer unique-color-dark">
      <div class="blue-gradient">
        <div class="container">
          <div class="row py-4 d-flex align-items-center">
            <div class="col-md-6 col-lg-5 text-center text-md-left mb-4 mb-md-0">
              <h6 class="mb-0 white-text">
                Get connected with us on social networks!
              </h6>
            </div>
            <div class="col-md-6 col-lg-7 text-center text-md-right">
              <a class="fb-ic ml-0" target="_blank">
                <i class="fab fa-facebook-f white-text mr-4"> </i>
              </a>
              <a
                class="tw-ic"
                href="https://twitter.com/KochiiApp/"
                target="_blank"
              >
                <i class="fab fa-twitter white-text mr-4"> </i>
              </a>
              <a
                class="reddit-ic"
                href="https://www.reddit.com/user/kochiiapp/"
                target="_blank"
              >
                <i class="fab fa-reddit-alien white-text mr-4"> </i>
              </a>
              <a
                class="li-ic"
                href="https://www.linkedin.com/in/jeffrey-ram-pineda-11587b112/"
                target="_blank"
              >
                <i class="fab fa-linkedin-in white-text mr-4"> </i>
              </a>
              <a
                class="ins-ic"
                href="https://www.instagram.com/kochiiapp/"
                target="_blank"
              >
                <i class="fab fa-instagram white-text mr-lg-4"> </i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="container mt-5 mb-4 text-center text-md-left">
        <div class="row mt-3">
          <div class="col-md-3 col-lg-4 col-xl-3 mb-4">
            <h6 class="text-uppercase font-weight-bold">
              <strong>Company</strong>
            </h6>
            <hr
              class="primary-color accent-2 mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px" }}
            />
            <p>
              Kochii is a personal open source project created by Jeffrey Ram
              Pineda as a hobby. It is created with Angular as a frontend
              framework, Koa.js for the backend server, and MongoDB as its
              database.
            </p>
          </div>
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase font-weight-bold">
              <strong>Technologies</strong>
            </h6>
            <hr
              class="primary-color accent-2 mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px" }}
            />
            <p>
              <a href="https://fdc.nal.usda.gov/">Food Data Central</a>
            </p>
            <p>
              <a href="https://angular.io/">Angular</a>
            </p>
            <p>
              <a href="https://koajs.com/">Koajs</a>
            </p>
            <p>
              <a href="https://www.mongodb.com/">MongoDB</a>
            </p>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase font-weight-bold">
              <strong>Useful links</strong>
            </h6>
            <hr
              class="primary-color accent-2 mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px" }}
            />
            <p>
              <a href="#!">Become an Affiliate</a>
            </p>
            <p>
              <a href="#!">Help</a>
            </p>
          </div>
          <div class="col-md-4 col-lg-3 col-xl-3">
            <h6 class="text-uppercase font-weight-bold">
              <strong>Contact</strong>
            </h6>
            <hr
              class="primary-color accent-2 mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "60px" }}
            />
            <p>
              <i class="fas fa-home  mr-2"></i>Toronto, ON, Canada
            </p>
            <p>
              <i class="fas fa-envelope mr-2"></i>contact@kochii.app
            </p>
            <p>
              <i class="fas fa-phone mr-2"></i>+ 01 234 567 8910
            </p>
          </div>
        </div>
      </div>
      <div class="footer-copyright text-center py-3">
        <small>
          <p>
            <Link to="/legal/terms-of-service">Terms of Service</Link>
            &nbsp;|&nbsp;
            <Link to="/legal/privacy-policy">Privacy Policy</Link>
          </p>
        </small>
        Kochii &copy; 2020 All Rights Reserved
      </div>
    </footer>
  )
}

export default Footer
