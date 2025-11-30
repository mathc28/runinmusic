document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('preinscriptionForm');
  const messageDiv = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Récupération des valeurs du formulaire
      const nom = document.getElementById('nom').value.trim();
      const email = document.getElementById('email').value.trim();
      const telephone = document.getElementById('telephone').value.trim();
      const course = document.getElementById('course').value;

      // Validation basique
      if (!nom || !email || !course) {
        showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      // Simulation d'envoi (à remplacer par un vrai appel API)
      // Ici vous pourriez faire un fetch() vers votre backend

      // Affichage du message de succès
      showMessage(`Merci ${nom} ! Votre pré-inscription pour le parcours ${getCourseLabel(course)} a bien été enregistrée. Vous recevrez un email à ${email} dès l'ouverture des inscriptions.`, 'success');

      // Réinitialisation du formulaire
      form.reset();

      // Optionnel : Scroll vers le message
      messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Fonction pour afficher les messages
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;

    // Effacer le message après 8 secondes
    setTimeout(() => {
      messageDiv.className = 'form-message';
      messageDiv.textContent = '';
    }, 8000);
  }

  // Fonction pour obtenir le libellé de la course
  function getCourseLabel(value) {
    const labels = {
      '1km': '1 km - enfant',
      '5km': '5 km - Familial',
      '12km': '12 km - Challenge',
      '28km': '28 km - Défi'
    };
    return labels[value] || value;
  }
});
