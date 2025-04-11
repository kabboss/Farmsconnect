const nodemailer = require('nodemailer');
const schedule = require('node-schedule'); // Pour la planification des emails

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaboreabwa2020@gmail.com',
        pass: 'swbo vejr klic otpu', // Utilise idéalement une variable d'environnement
    }
});

// En-têtes CORS communs
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event, context) => {
    // Réponse préliminaire pour les requêtes OPTIONS (préflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: corsHeaders,
            body: '',
        };
    }

    // Refus des autres méthodes que POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Méthode non autorisée' }),
        };
    }

    try {
        const { purchaseDetails, delay } = JSON.parse(event.body);

        // Validation des données reçues
        if (!purchaseDetails || !purchaseDetails.email || !purchaseDetails.username) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ success: false, message: "Informations manquantes" })
            };
        }

        if (typeof delay !== 'number' || delay < 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ success: false, message: "Délai invalide" })
            };
        }

        // Configuration de l'email
        const mailOptionsClient = {
            from: 'kaboreabwa2020@gmail.com',
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
        setTimeout(async () => {
            try {
                await transporter.sendMail(mailOptionsClient);
                console.log(`✅ Email envoyé à ${purchaseDetails.email}`);
            } catch (error) {
                console.error('❌ Erreur lors de l\'envoi de l\'email :', error);
            }
        }, delay * 60000); // Délai en minutes → millisecondes

        // Réponse au frontend
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: `Email planifié pour ${purchaseDetails.email} dans ${delay} minutes.`
            })
        };

    } catch (error) {
        console.error('❌ Erreur lors du traitement de la requête :', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: "Erreur interne du serveur" })
        };
    }
};
