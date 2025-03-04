const mongoose = require('mongoose');
const Message = require('../../models/Message'); // Assure-toi que ton modèle 'Message' est bien défini

// Connexion à MongoDB dans la fonction (important car les fonctions Lambda sont stateless)
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB...'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Fonction Lambda pour ajouter un like à un commentaire
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,  // Méthode non autorisée
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    const { id } = event.pathParameters;  // Récupérer l'ID du commentaire depuis les paramètres de l'URL

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'ID non valide' })
        };
    }

    try {
        // Trouver le commentaire avec l'ID fourni
        const comment = await Message.findById(id);
        if (!comment) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Commentaire non trouvé' })
            };
        }

        // Incrémenter le nombre de likes
        comment.likes += 1;
        await comment.save();

        // Retourner la réponse avec le nombre de likes mis à jour
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Like ajouté', likes: comment.likes })
        };
    } catch (err) {
        console.error('Erreur lors de l\'ajout du like :', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erreur serveur', error: err.message })
        };
    }
};
