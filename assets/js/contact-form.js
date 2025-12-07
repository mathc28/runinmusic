// contact-form.js - Gestion du formulaire de contact

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('contact-form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Récupération des valeurs du formulaire
            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const telephone = document.getElementById('telephone').value.trim();
            const sujet = document.getElementById('sujet').value;
            const message = document.getElementById('message').value.trim();

            // Validation basique
            if (!nom || !email || !sujet || !message) {
                showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Validation email basique
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Préparation des données
            const formData = {
                nom: nom,
                email: email,
                telephone: telephone,
                sujet: sujet,
                message: message,
                date: new Date().toISOString()
            };

            // Simulation d'envoi (à remplacer par un vrai appel API)
            // Dans un environnement de production, vous enverriez les données à un serveur
            console.log('Données du formulaire:', formData);

            // Simulation de succès
            setTimeout(() => {
                showMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
                contactForm.reset();

                // Masquer le message après 5 secondes
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                }, 5000);
            }, 500);

            // EXEMPLE pour un vrai envoi avec fetch (décommentez et adaptez):
            /*
            fetch('https://votre-api.com/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de l\'envoi du message');
                }
                return response.json();
            })
            .then(data => {
                showMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Erreur:', error);
                showMessage('Une erreur est survenue. Veuillez réessayer plus tard.', 'error');
            });
            */
        });
    }

    // Fonction pour afficher les messages
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.style.opacity = '1';
    }
});
