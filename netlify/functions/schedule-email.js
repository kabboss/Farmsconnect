const nodemailer = require('nodemailer');
const schedule = require('node-schedule'); // Pour la planification des emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaboreabwa2020@gmail.com',
        pass: 'swbo vejr klic otpu', // Utilisation de variable d'environnement pour sécuriser le mot de passe
    }
});

exports.handler = async (event, context) => {
    // Gérer les requêtes préflight CORS (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    // Vérifier que la requête est bien un POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    // Récupérer les données envoyées par le frontend
    try {
        const { purchaseDetails, delay } = JSON.parse(event.body);

        console.log("Données reçues :", purchaseDetails, "Délai reçu :", delay);

        // Vérification des entrées
        if (!purchaseDetails || !purchaseDetails.email || !purchaseDetails.username) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "Informations manquantes" })
            };
        }

        if (typeof delay !== 'number' || delay < 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "Délai invalide" })
            };
        }

        const mailOptionsClient = {
            from: process.env.EMAIL_USER,
            to: purchaseDetails.email,
            subject: '✅ Merci pour votre achat sur FarmsConnect !',
            text: `👋 Bonjour ${purchaseDetails.username},

Nous vous remercions chaleureusement pour votre achat sur *FarmsConnect*. Votre satisfaction est notre priorité absolue.

Afin de mieux répondre à vos besoins et d'améliorer continuellement nos services, nous serions ravis d'avoir votre retour via ce court formulaire de feedback :

🔗 [Partagez votre avis ici !](https://ee.kobotoolbox.org/x/uhCnWFCN)

Chaque commentaire compte pour nous et contribue à vous offrir une expérience encore plus optimale.

Merci de nous faire confiance pour vos achats.
Nous restons à votre disposition pour toute question ou assistance.

À très bientôt !

📧 Pour toute question, [contactez-nous directement ici](https://wa.me/+22656663638).

Cordialement,  
L'équipe FarmsConnect`
        };

        // Planifier l'envoi de l'email après le délai spécifié
        console.log(`Email planifié pour ${purchaseDetails.email} dans ${delay} minutes.`);
        
        setTimeout(async () => {
            try {
                await transporter.sendMail(mailOptionsClient);
                console.log('✅ Email envoyé avec succès au client !');
            } catch (error) {
                console.error('❌ Erreur lors de l\'envoi de l\'email :', error);
            }
        }, delay * 60000); // Conversion minutes → millisecondes

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Email planifié pour ${purchaseDetails.email} dans ${delay} minutes.`
            })
        };

    } catch (error) {
        console.error('❌ Erreur lors du traitement de la requête :', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Erreur interne du serveur" })
        };
    }
};