import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

const Navbar = ({ siteTitle }) => {
  return (
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark scrolling-navbar unique-color-dark">
      <div class="container">
        <Link className="navbar-brand" to="/">
          <img alt="Kochii banner" src={"/kochii-banner.png"} />
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#basicExampleNav"
          aria-controls="basicExampleNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="basicExampleNav">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li class="nav-item">
              <Link className="nav-link" to="/about-us">
                About Us
              </Link>
            </li>
          </ul>
          <ul class="navbar-nav nav-flex-icons">
            <li class="nav-item">
              <a
                class="btn btn-sm btn-light"
                href="/register"
                style={{ borderRadius: "10em" }}
              >
                Register
              </a>
            </li>
            <li class="nav-item">
              <a
                class="btn btn-sm blue-gradient"
                href="/login"
                style={{ borderRadius: "10em" }}
              >
                Login
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" target="_blank">
                <i class="fab fa-facebook-f"></i>
              </a>
            </li>
            <li class="nav-item">
              <a
                href="https://twitter.com/KochiiApp/"
                class="nav-link"
                target="_blank"
              >
                <i class="fab fa-twitter"></i>
              </a>
            </li>
            <li class="nav-item">
              <a
                href="https://github.com/jeffreyrampineda/kochii"
                class="nav-link"
                target="_blank"
              >
                <i class="fab fa-github"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  siteTitle: PropTypes.string,
};

Navbar.defaultProps = {
  siteTitle: ``,
};

export default Navbar;
