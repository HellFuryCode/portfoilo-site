document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".page-section");
  links.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      sections.forEach(section => {
        section.style.display = section.id === target ? "block" : "none";
      });
    });
  });
});