
  const stars1 = document.getElementById("stars");
  const stars2 = document.getElementById("stars2");
  const stars3 = document.getElementById("stars3");

  function generateShadows(n) {
    const shadows = [];
    for (let i = 0; i < n; i++) {
      const x = Math.floor(Math.random() * window.innerWidth);
      const y = Math.floor(Math.random() * window.innerHeight);
      shadows.push(`${x}px ${y}px #fff`);
    }
    return shadows.join(", ");
  }

  if (stars1) stars1.style.boxShadow = generateShadows(70);
  if (stars2) stars2.style.boxShadow = generateShadows(40);
  if (stars3) stars3.style.boxShadow = generateShadows(20);

  // toggle hamburger icon for mobile so its like collapsiable
  function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}

// https://youtu.be/k4Tyh-MVuxg
