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

    if (event.httpMethod !== 'PUT') {
        return {
            statusCode: 405,  // Méthode non autorisée
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    const { id } = event.pathParameters; // Récupérer l'ID de l'URL
    const { content } = JSON.parse(event.body); // Récupérer le contenu du message dans le corps de la requête

    try {
        // Mettre à jour le message dans la base de données
        const updatedMessage = await Message.findByIdAndUpdate(
            id, 
            { content }, 
            { new: true }  // Retourner le document mis à jour
        );

        // Si le message n'existe pas, retourner une erreur 404
        if (!updatedMessage) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Message non trouvé' })
            };
        }

        // Retourner le message mis à jour
        return {
            statusCode: 200,  // Mise à jour réussie
            body: JSON.stringify(updatedMessage)
        };
    } catch (error) {
        console.error('Erreur lors de la mise à jour du message:', error);
        return {
            statusCode: 500, // Erreur serveur
            body: JSON.stringify({ error: error.message })
        };
    }
};
