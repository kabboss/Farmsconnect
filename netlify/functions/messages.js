const mongoose = require('mongoose');
const Message = require('../../models/Message'); // Assure-toi que ton modèle 'Message' est défini correctement

// Connexion à MongoDB dans la fonction (important car les fonctions Lambda sont stateless)
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB...'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,  // Méthode non autorisée
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    try {
        // Récupérer les données envoyées dans le corps de la requête
        const { username, content } = JSON.parse(event.body);

        // Création d'un nouveau message
        const newMessage = new Message({ username, content });

        // Sauvegarde du message dans la base de données
        const message = await newMessage.save();

        // Optionnel : Si tu souhaites émettre un événement via WebSocket ou autre méthode de communication en temps réel
        // io.emit('newMessage', message); // Tu devras gérer cette partie séparément avec un service de websockets

        // Retourner la réponse avec le message créé
        return {
            statusCode: 201, // Création réussie
            body: JSON.stringify(message)
        };
    } catch (error) {
        console.error('Erreur lors de la création du message:', error);
        return {
            statusCode: 500, // Erreur serveur
            body: JSON.stringify({ error: error.message })
        };
    }
};
