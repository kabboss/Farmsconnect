const mongoose = require('mongoose');
const Message = require('../../models/Message'); // Assure-toi que ton modèle 'Message' est défini correctement

// Connexion à MongoDB dans la fonction (important car les fonctions Lambda sont stateless)
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB...'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Fonction Lambda
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,  // Méthode non autorisée
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    const { id } = event.pathParameters; // Récupérer l'ID de l'URL
    const { username, content } = JSON.parse(event.body); // Récupérer les données du corps de la requête

    const reply = { username, content };

    try {
        // Ajouter la réponse au message spécifié
        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { $push: { replies: reply } },
            { new: true }
        );

        // Si le message n'est pas trouvé, retourner une erreur 404
        if (!updatedMessage) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Message non trouvé' })
            };
        }

        // Retourner le message mis à jour avec la nouvelle réponse
        return {
            statusCode: 200,
            body: JSON.stringify(updatedMessage)
        };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la réponse:', error);
        return {
            statusCode: 500,  // Erreur serveur
            body: JSON.stringify({ error: error.message })
        };
    }
};
