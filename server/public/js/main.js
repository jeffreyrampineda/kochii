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
