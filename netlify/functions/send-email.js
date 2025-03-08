const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaboreabwa2020@gmail.com', // Adresse e-mail de l'expéditeur
        pass: 'swbo vejr klic otpu' // Mot de passe de l'application
    }
});

exports.handler = async (event, context) => {
    // 🔹 Gérer les pré-requêtes CORS (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    // 🔹 Vérifier si la méthode est bien POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Méthode non autorisée
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    try {
        // 🔹 Extraire les données de la requête
        const { email, subject, content } = JSON.parse(event.body);

        // 🔹 Vérifier si l'email et le contenu sont présents
        if (!email || !content) {
            return {
                statusCode: 400, // Bad Request
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: "L'adresse e-mail ou le contenu est manquant." })
            };
        }

        // 🔹 Définir les options de l'e-mail
        const mailOptions = {
            from: 'kaboreabwa2020@gmail.com',
            to: email,
            subject: subject || '🔴Nouvelle commande reçue',
            text: content
        };

        // 🔹 Envoyer l'e-mail
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé :', info.response);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ message: 'E-mail envoyé avec succès.' })
        };
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'e-mail :', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'e-mail.' })
        };
    }
};
