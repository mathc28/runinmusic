<?php

// ----------------------------------------------------
// 1. DÉFINITION DES INFORMATIONS DE CONNEXION 
// ----------------------------------------------------

$bdd_hote = "runinmz68.mysql.db";         
$bdd_nom = "runinmz68";                   
$bdd_utilisateur = "runinmz68";           
$bdd_mot_de_passe = "rim2025Rim2025";     // VÉRIFIEZ CE MOT DE PASSE EN DERNIER RECOURS !

$email_destinataire = "contact@runinmusic.fr";
$email_expediteur = "no-reply@runinmusic.fr";

// ----------------------------------------------------
// 2. VÉRIFICATION DU POST ET HONEYPOT
// ----------------------------------------------------

// L'appel AJAX est toujours une méthode POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Méthode non permise
    die(json_encode(['success' => false, 'message' => 'Méthode invalide.']));
}

// VÉRIFICATION HONEYPOT
if (!empty($_POST['spam_check'])) {
    http_response_code(200); // Répondre 200 pour tromper le bot
    die(json_encode(['success' => true, 'message' => 'Merci pour votre inscription !'])); 
}

// Nettoyage et récupération des données du formulaire
$nom = htmlspecialchars(trim($_POST['nom'] ?? ''));
$email = htmlspecialchars(trim($_POST['email'] ?? ''));
$telephone = htmlspecialchars(trim($_POST['telephone'] ?? ''));
$course = htmlspecialchars(trim($_POST['course'] ?? ''));

// Initialisation des statuts
$statut_bdd_success = false;
$statut_mail_success = false;
$message_bdd = "";

// ----------------------------------------------------
// 3. TÂCHE 1 : ENREGISTREMENT DANS LA BASE DE DONNÉES
// ----------------------------------------------------

try {
    $connexion = new PDO("mysql:host=$bdd_hote;dbname=$bdd_nom;charset=utf8", $bdd_utilisateur, $bdd_mot_de_passe);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $requete = $connexion->prepare(
        "INSERT INTO preinscriptions (nom, email, telephone, course) 
         VALUES (:nom, :email, :telephone, :course)"
    );

    $requete->bindParam(':nom', $nom);
    $requete->bindParam(':email', $email);
    $requete->bindParam(':telephone', $telephone);
    $requete->bindParam(':course', $course);
    $requete->execute();
    
    $statut_bdd_success = true;
    $message_bdd = "Enregistrement BDD réussi.";

} catch(PDOException $e) {
    // Si la connexion ou l'insertion échoue, on stocke le message d'erreur
    $message_bdd = "Erreur BDD: " . $e->getMessage();
}

// ----------------------------------------------------
// 4. TÂCHE 2 : ENVOI PAR E-MAIL DE NOTIFICATION
// ----------------------------------------------------

if ($statut_bdd_success) {
    $sujet = "NOUVELLE PRÉ-INSCRIPTION: " . $course;
    $message_mail = "Un participant a soumis une pré-inscription :\n\n";
    $message_mail .= "Nom: " . $nom . "\n";
    $message_mail .= "Email: " . $email . "\n";
    // ... (Reste des détails) ...

    $headers = "From: " . $email_expediteur . "\r\n" .
               "Reply-To: " . $email . "\r\n";

    if (mail($email_destinataire, $sujet, $message_mail, $headers)) {
        $statut_mail_success = true;
    }
} else {
    // Si la BDD a échoué, l'e-mail n'est pas envoyé, le statut reste false
}


// ----------------------------------------------------
// 5. RÉPONSE JSON FINALE
// ----------------------------------------------------

header('Content-Type: application/json');

$response = [
    'success' => $statut_bdd_success && $statut_mail_success,
    'message' => $statut_bdd_success ? "Merci, votre pré-inscription est confirmée." : "Erreur Serveur: Votre inscription n'a pas pu être enregistrée.",
    'details' => [
        'bdd' => $message_bdd,
        'mail' => $statut_mail_success ? 'E-mail envoyé.' : 'Échec de l\'envoi d\'e-mail.',
    ]
];

echo json_encode($response);
exit();