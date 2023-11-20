// ------------------ Navigation Bar
const navbarBtn = document.querySelector(".navbar__btn");
const hamburger = document.querySelector(".navbar__btn--icon");
const navbarMenuContainer = document.querySelector(".navbar__menu-container");
const nav = document.querySelector(".nav");

let showMenu = false;

navbarBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    hamburger.classList.add("open");
    nav.classList.add("open");
    navbarMenuContainer.classList.add("open");

    showMenu = true;
  } else {
    hamburger.classList.remove("open");
    nav.classList.remove("open");
    navbarMenuContainer.classList.remove("open");

    showMenu = false;
  }
}

// -------------------- Accordion

const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute("aria-expanded");

  if (itemToggle == "false") {
    this.setAttribute("aria-expanded", "true");
  } else {
    this.setAttribute("aria-expanded", "false");
  }
}

items.forEach((item) => item.addEventListener("click", toggleAccordion));
