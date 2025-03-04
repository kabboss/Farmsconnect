const nodemailer = require('nodemailer');

// Configure le transporteur pour envoyer des e-mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaboreabwa2020@gmail.com', // Ton email d'expéditeur
        pass: 'swbo vejr klic otpu' // Ton mot de passe ou mot de passe d'application (si nécessaire)
    }
});

// Fonction Lambda
exports.handler = async (event, context) => {
    // Vérifier que la méthode HTTP est bien POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,  // Method Not Allowed
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    // Extraire les données envoyées dans la requête
    const { email, subject, content } = JSON.parse(event.body);  // Récupérer les données de la requête

    // Vérifier si l'email du destinataire est fourni
    if (!email) {
        return {
            statusCode: 400,  // Bad Request
            body: JSON.stringify({ error: "L'adresse e-mail du destinataire est manquante." })
        };
    }

    // Définir les options de l'e-mail
    const mailOptions = {
        from: 'kaboreabwa2020@gmail.com',  // Adresse de l'expéditeur
        to: email,  // Adresse du destinataire reçue dynamiquement
        subject: subject || 'Nouvelle commande reçue',  // Sujet de l'e-mail
        text: content  // Contenu de l'e-mail
    };

    try {
        // Envoi de l'email
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé :', info.response);
        
        // Retourner une réponse de succès
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'E-mail envoyé avec succès.' })
        };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        
        // Retourner une réponse d'erreur
        return {
            statusCode: 500,  // Internal Server Error
            body: JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'e-mail.' })
        };
    }
};
