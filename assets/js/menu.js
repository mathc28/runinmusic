document.addEventListener('DOMContentLoaded', () => {
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  // Toggle du menu burger
  if (burgerMenu) {
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
      navMenu.classList.toggle('active');

      // Mise à jour de l'attribut aria-expanded pour l'accessibilité
      const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
      burgerMenu.setAttribute('aria-expanded', !isExpanded);

      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Fermer le menu quand on clique sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Fermer le menu quand on clique en dehors
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !burgerMenu.contains(e.target)) {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
      burgerMenu.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Fermer le menu avec la touche Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
      burgerMenu.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Réinitialiser le menu lors du redimensionnement de la fenêtre
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
      burgerMenu.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
});
