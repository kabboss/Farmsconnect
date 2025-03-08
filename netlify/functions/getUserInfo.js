const mongoose = require('mongoose');
const User = require('../../models/User');  // Assure-toi que tu as la bonne référence pour le modèle User

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
            statusCode: 405,  // Method Not Allowed
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    const { userId } = JSON.parse(event.body);  // Extraction des données envoyées en JSON

    try {
        const user = await User.findById(userId);  // Recherche de l'utilisateur dans la base de données
        return {
            statusCode: 200,
            body: JSON.stringify(user)  // Envoi de l'utilisateur trouvé en réponse
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur lors de la récupération des informations de l\'utilisateur.' })
        };
    }
};
