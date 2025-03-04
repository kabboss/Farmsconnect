const mongoose = require('mongoose');
const Annonce = require('../../models/Annonce');  // Assure-toi que tu as le modèle 'Annonce' défini

// Connexion à MongoDB dans la fonction (important car les fonctions Lambda sont stateless)
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB...'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Fonction Lambda
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,  // Method Not Allowed
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    // Récupérer les paramètres de la requête
    const { vendeur, contact } = event.queryStringParameters;

    if (!vendeur || !contact) {
        return {
            statusCode: 400,  // Bad Request
            body: JSON.stringify({ message: 'Paramètres manquants : vendeur et contact sont nécessaires.' })
        };
    }

    try {
        // Récupérer le nombre d'annonces pour ce vendeur et contact
        const annoncesCount = await Annonce.countDocuments({
            emailVendeur: vendeur,
            contactPrincipal: contact
        });

        // Retourner la réponse avec le nombre d'annonces
        return {
            statusCode: 200,  // OK
            body: JSON.stringify({ annoncesCount })
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
        return {
            statusCode: 500,  // Internal Server Error
            body: JSON.stringify({ message: 'Erreur serveur.' })
        };
    }
};
