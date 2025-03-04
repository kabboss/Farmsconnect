const nodemailer = require('nodemailer');
const schedule = require('node-schedule'); // Pour la planification des emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaboreabwa2020@gmail.com',
        pass: 'swbo vejr klic otpu', // Utilisation de variable d'environnement pour sécuriser le mot de passe
    }
});

// Fonction Lambda pour planifier l'email
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Méthode non autorisée
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    const { purchaseDetails, delay } = JSON.parse(event.body);

    // Calculer l'heure de planification en fonction du délai
    const scheduledTime = new Date();
    scheduledTime.setMinutes(scheduledTime.getMinutes() + delay);

    const mailOptionsClient = {
        from: 'kaboreabwa2020@gmail.com',
        to: purchaseDetails.email, // Email du client
        subject: '✔ Merci pour votre achat sur FarmsConnect !',
        text: `👋 Bonjour ${purchaseDetails.username},
    
    Nous vous remercions chaleureusement pour votre achat sur *FarmsConnect*. Votre satisfaction est notre priorité absolue. 
    
    Afin de mieux répondre à vos besoins et d'améliorer continuellement nos services, nous serions ravis d'avoir votre retour via ce court formulaire de feedback :  
              
    🔗 [Partagez votre avis ici !](https://ee.kobotoolbox.org/x/uhCnWFCN)
    
    Chaque commentaire compte pour nous et contribue à vous offrir une expérience encore plus optimale.  
    
    Merci de nous faire confiance pour vos achats.  
    Nous restons à votre disposition pour toute question ou assistance.  
    
    À très bientôt !  
    
📧 Pour toute question, [contactez-nous directement ici](https://wa.me/+22656663638).*  
Cordialement,  
L'équipe FarmsConnect`
    };

    // Planifier l'envoi de l'email après le délai spécifié
    schedule.scheduleJob(scheduledTime, async () => {
        try {
            await transporter.sendMail(mailOptionsClient);
            console.log('Email envoyé au client après la planification');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email au client :', error);
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            message: `Email planifié pour le client dans ${delay} minutes.`
        })
    };
};
