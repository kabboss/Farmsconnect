const mongoose = require('mongoose');
const Annonce = require('../../models/Annonce');  // Assure-toi que tu as bien ton modèle 'Annonce' défini

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

    try {
        // Récupérer toutes les annonces
        const annonces = await Annonce.find();

        // Retourner la réponse avec les annonces
        return {
            statusCode: 200,  // OK
            body: JSON.stringify(annonces)
        };
    } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
        return {
            statusCode: 500,  // Internal Server Error
            body: JSON.stringify({ message: 'Erreur lors du chargement des annonces' })
        };
    }
};
