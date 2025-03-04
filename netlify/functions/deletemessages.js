const mongoose = require('mongoose');
const Message = require('./models/Message'); // Assure-toi que ton modèle 'Message' est défini correctement

// Connexion à MongoDB dans la fonction (important car les fonctions Lambda sont stateless)
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB...'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));
// Fonction Lambda
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'DELETE') {
        return {
            statusCode: 405,  // Méthode non autorisée
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    const { id } = event.pathParameters; // Récupérer l'ID de l'URL

    try {
        // Supprimer le message de la base de données
        const deletedMessage = await Message.findByIdAndDelete(id);

        // Si le message n'existe pas, retourner une erreur 404
        if (!deletedMessage) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Message non trouvé' })
            };
        }

        // Retourner une réponse vide (status 204 No Content)
        return {
            statusCode: 204,  // Suppression réussie
            body: JSON.stringify({ message: 'Message supprimé avec succès' })
        };
    } catch (error) {
        console.error('Erreur lors de la suppression du message:', error);
        return {
            statusCode: 500, // Erreur serveur
            body: JSON.stringify({ error: error.message })
        };
    }
};
