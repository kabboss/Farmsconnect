const mongoose = require('mongoose');
const Message = require('./models/Message'); // Assure-toi que ton modèle 'Message' est défini correctement

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

    const { username, content } = JSON.parse(event.body); // Récupérer les données du corps de la requête

    // Vérifier que les champs "username" et "content" sont présents
    if (!username || !content) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Les champs "username" et "content" sont requis' })
        };
    }

    try {
        // Créer un nouveau commentaire
        const comment = new Message({ username, content });
        await comment.save();

        // Retourner une réponse avec le commentaire ajouté
        return {
            statusCode: 201,
            body: JSON.stringify(comment)
        };
    } catch (err) {
        console.error('Erreur lors de l\'ajout d\'un commentaire :', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erreur serveur' })
        };
    }
};
