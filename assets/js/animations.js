// Animations au scroll avec Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  // Options pour l'Intersection Observer
  const observerOptions = {
    threshold: 0.1, // L'élément doit être visible à 10%
    rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit visible
  };

  // Callback quand un élément entre/sort du viewport
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Ajouter la classe visible quand l'élément entre dans le viewport
        entry.target.classList.add('visible');
        // Optionnel : arrêter d'observer cet élément une fois animé
        observer.unobserve(entry.target);
      }
    });
  };

  // Créer l'observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observer tous les éléments avec les classes d'animation
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Animation pour le compteur qui apparaît progressivement
  const countdownBlocks = document.querySelectorAll('.count-block');
  countdownBlocks.forEach((block, index) => {
    block.style.transitionDelay = `${index * 0.1}s`;
  });
});
