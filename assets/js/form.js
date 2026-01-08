document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('preinscriptionForm');
    const messageDiv = document.getElementById('form-message');
    
    // Assurez-vous que l'URL d'action du formulaire est correcte, y compris le slash /
    const actionUrl = form ? form.getAttribute('action') : '/traitement_inscription.php';

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // 🛑 Empêche la soumission HTML native pour rester sur la page

            // 1. Récupération et Validation (comme avant)
            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const course = document.getElementById('course').value;

            if (!nom || !email || !course) {
                showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Désactivation du bouton pendant l'envoi
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';
            showMessage('Traitement de votre demande...', 'info');

            // 2. Construction des données
            const formData = new FormData(form);

            try {
                // 3. Envoi AJAX (méthode Fetch)
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json(); // Le PHP répond en JSON

                // 4. Affichage du résultat basé sur la réponse JSON du PHP
                if (result.success) {
                    showMessage(result.message, 'success');
                    form.reset();
                } else {
                    // Si le PHP retourne 'success: false'
                    let error_message = result.message || "Une erreur inconnue est survenue.";
                    
                    // Si l'échec est lié à la BDD, on ajoute le détail pour le diagnostic
                    if (result.details && result.details.bdd.startsWith('Erreur BDD:')) {
                        error_message += " (Erreur technique BDD: Vérifiez les logs serveurs)";
                    }
                    showMessage(error_message, 'error');
                }

            } catch (error) {
                // Erreur réseau ou JSON invalide
                showMessage('Connexion serveur échouée ou réponse invalide.', 'error');
                console.error('Erreur Fetch ou JSON:', error);

            } finally {
                // Réactivation du bouton
                submitButton.disabled = false;
                submitButton.textContent = 'Valider ma pré-inscription';
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Fonction pour afficher les messages (inchangée)
    function showMessage(text, type) {
        // ... (code showMessage) ...
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;

        setTimeout(() => {
            messageDiv.className = 'form-message';
            messageDiv.textContent = '';
        }, 8000);
    }

    // Fonction pour obtenir le libellé de la course (inchangée)
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