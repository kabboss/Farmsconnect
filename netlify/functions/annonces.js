const mongoose = require('mongoose');
const Annonce = require('../../models/Annonce');  // Assure-toi que tu as le modèle 'Annonce' défini

// Connexion à MongoDB dans la fonction (important car les fonctions Lambda sont stateless)
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB...'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Fonction Lambda
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,  // Method Not Allowed
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    // Récupérer les données de la requête
    const { emailVendeur, contactPrincipal } = JSON.parse(event.body);

    try {
        // Vérifiez le nombre d'annonces existantes pour ce vendeur
        const annoncesExistantes = await Annonce.find({
            emailVendeur,
            contactPrincipal
        });

        if (annoncesExistantes.length >= 3) {
            return {
                statusCode: 400,  // Bad Request
                body: JSON.stringify({
                    message: 'Vous avez atteint le nombre maximal de 3 annonces autorisées.'
                })
            };
        }

        // Créer la nouvelle annonce et l'enregistrer dans la base de données
        const nouvelleAnnonce = new Annonce(JSON.parse(event.body));  // Créer une nouvelle instance de l'annonce avec les données reçues
        await nouvelleAnnonce.save();

        // Retourner une réponse de succès
        return {
            statusCode: 201,  // Created
            body: JSON.stringify({
                message: 'Annonce ajoutée avec succès !',
                annonce: nouvelleAnnonce
            })
        };
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’annonce:', error);
        return {
            statusCode: 500,  // Internal Server Error
            body: JSON.stringify({ message: 'Erreur serveur.' })
        };
    }
};
