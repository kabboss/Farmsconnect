const mongoose = require('mongoose');
const Message = require('./models/Message');  // Assure-toi que ton modèle 'Message' est défini correctement

// Connexion à MongoDB dans la fonction (important car les fonctions Lambda sont stateless)
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB...'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Fonction Lambda
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,  // Méthode non autorisée
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    try {
        // Récupérer tous les messages
        const messages = await Message.find();

        // Retourner les messages avec un statut 200 OK
        return {
            statusCode: 200,  // OK
            body: JSON.stringify(messages)
        };
    } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        return {
            statusCode: 400,  // Erreur de la requête
            body: JSON.stringify({ message: 'Erreur lors du chargement des messages', error })
        };
    }
};
