const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

// Configuration de Nodemailer pour l'envoi des emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaboreabwa2020@gmail.com',
        pass: 'swbo vejr klic otpu' // Remplace avec ton mot de passe ou une méthode plus sécurisée
    }
});

exports.handler = async (event, context) => {
    // Gérer les requêtes préflight CORS (OPTIONS)
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

    // Vérifier si la méthode HTTP est bien POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Méthode HTTP non autorisée, utilisez POST.' })
        };
    }

    // Récupérer les données envoyées dans le corps de la requête
    const { username, email, contact, contact2, price, quantity, weight, Produit: nomproduit, traitement, typeAbattage, NomAbattre, Residence, location } = JSON.parse(event.body);

    // Vérifier que le traitement est bien défini
    if (!traitement) {
        console.error("Erreur : La variable 'traitement' est manquante dans la requête.");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "L'option de traitement est requise." })
        };
    }

    try {
        // Préparer l'email pour le client
        const mailOptionsClient = {
            from: 'kaboreabwa2020@gmail.com',
            to: email,
            subject: 'Confirmation de commande',
            text: `
🛒✨ Merci, ${username}, pour votre commande !

📋 Détails de votre commande :
🍗 Produit : ${nomproduit}
🔢 Quantité : ${quantity}
⚖️ Poids Total : ${weight} kg
💸 Prix Total à payer : ${price} FCFA
🚚 Livraison gratuite
🛠️ Traitement choisi : ${traitement}
🔪 Type d'abattage : ${typeAbattage}
🐔🔪 Quantité à abattre : ${NomAbattre}
🏡 Quartier de Residence : ${Residence}

⚠️ Note importante :
Le prix du produit peut augmenter en fonction du poids choisi. Chaque kilogramme supplémentaire sera facturé selon le tarif spécifique du produit. Pour plus de détails, veuillez consulter la "Note importante aux acheteurs" 📑.

📞 Nous vous contacterons prochainement sur votre numéro ${contact} 📱 pour valider la commande.

💬 Vous avez des questions ou souhaitez nous contacter immédiatement ?
📲 👉 [Cliquez ici pour nous écrire sur WhatsApp](https://wa.me/+22656663638)
            `
        };

        // Envoi de l'email au client
        await transporter.sendMail(mailOptionsClient);
        console.log('Email envoyé au client');

        // Préparer l'email pour Farmsconnect
        const mailOptionsFarmsconnect = {
            from: 'kaboreabwa2020@gmail.com',
            to: 'kaboreabwa2020@gmail.com', // Destinataire: Farmsconnect
            subject: 'Nouvelle commande reçue',
            text: `
📩 Nouvelle commande reçue !

📋 Détails de la commande :
👤 Client : ${username}
✉️ Email : ${email}
📞 Contact : ${contact}
📞 Contact2 : ${contact2}

🍗 Produit : ${nomproduit}
🔢 Quantité : ${quantity}
⚖️ Poids Total : ${weight} kg
💸 Prix Total : ${price} FCFA
🛠️ Traitement : ${traitement}
🔪 Type d'abattage : ${typeAbattage}
🐔🔪 Quantité à abattre : ${NomAbattre}
🏡 Quartier de Residence : ${Residence}
📍 Localisation du client :
- Latitude: ${location.latitude},
- Longitude: ${location.longitude}

⏳ Action requise : Veuillez traiter cette commande dans les meilleurs délais. ⏱️
            `
        };

        // Envoi de l'email à Farmsconnect
        await transporter.sendMail(mailOptionsFarmsconnect);
        console.log('Email envoyé à Farmsconnect');

        // Répondre avec succès
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Commande passée avec succès, e-mails envoyés !' })
        };

    } catch (error) {
        console.error('Erreur lors de la commande :', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur lors de la commande : ' + error.message })
        };
    }
};
