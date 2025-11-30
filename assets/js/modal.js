document.addEventListener('DOMContentLoaded', () => {
  // Sélectionner tous les éléments déclencheurs et les fermetures
  const openButtons = document.querySelectorAll('[data-open]');
  const closeButtons = document.querySelectorAll('[data-close]');
  const modals = document.querySelectorAll('.modal');

  // Fonction pour ouvrir
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Empêche le saut de page si lien href="#"
      const modalId = btn.getAttribute('data-open');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('is-visible');
      }
    });
  });

  // Fonction pour fermer
  function closeModal(modal) {
    modal.classList.remove('is-visible');
    
    // STOPPER LA VIDÉO YOUTUBE (Astuce importante)
    // On réinitialise la source de l'iframe pour couper le son
    const iframe = modal.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = ''; // On vide
      iframe.src = src; // On remet l'url (pour la prochaine fois)
    }
  }

  // Clic sur la croix
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId);
      closeModal(modal);
    });
  });

  // Clic en dehors de la modale (sur l'overlay)
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Fermeture avec la touche "Echap" (Accessibilité)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const visibleModal = document.querySelector('.modal.is-visible');
      if (visibleModal) {
        closeModal(visibleModal);
      }
    }
  });
});