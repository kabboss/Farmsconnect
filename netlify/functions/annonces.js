const mongoose = require('mongoose');
const Annonce = require('../../models/Annonce');  // Assure-toi que ce chemin est correct

const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

// Éviter de reconnecter à chaque requête
if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('✅ Connecté à MongoDB'))
        .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));
}

// Fonction Lambda
exports.handler = async (event, context) => {
    console.log("📩 Requête reçue :", event.httpMethod, event.body);

    if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
        return {
            statusCode: 405,  // Method Not Allowed
            body: JSON.stringify({ message: 'Méthode non autorisée. Utilisez POST ou GET.' })
        };
    }

    try {
        let data;
        
        // Sécuriser le parsing JSON (éviter les erreurs si event.body est null en GET)
        if (event.body) {
            try {
                data = JSON.parse(event.body);
            } catch (parseError) {
                return {
                    statusCode: 400,  // Bad Request
                    body: JSON.stringify({ message: 'Données JSON invalides.' })
                };
            }
        }

        // Gestion des requêtes GET
        if (event.httpMethod === 'GET') {
            const annonces = await Annonce.find(); // Récupérer toutes les annonces
            return {
                statusCode: 200,
                body: JSON.stringify(annonces)
            };
        }

        // Gestion des requêtes POST
        if (event.httpMethod === 'POST') {
            const { emailVendeur, contactPrincipal } = data;

            // Vérifier que les champs requis sont présents
            if (!emailVendeur || !contactPrincipal) {
                return {
                    statusCode: 400,  // Bad Request
                    body: JSON.stringify({ message: 'Champs requis manquants.' })
                };
            }

            // Vérifier si le vendeur a déjà 3 annonces
            const annoncesExistantes = await Annonce.find({ emailVendeur, contactPrincipal });

            if (annoncesExistantes.length >= 3) {
                return {
                    statusCode: 400,  // Bad Request
                    body: JSON.stringify({ message: 'Vous avez atteint le nombre maximal de 3 annonces.' })
                };
            }

            // Créer et sauvegarder l'annonce
            const nouvelleAnnonce = new Annonce(data);
            await nouvelleAnnonce.save();

            return {
                statusCode: 201,  // Created
                body: JSON.stringify({ message: 'Annonce ajoutée avec succès !', annonce: nouvelleAnnonce })
            };
        }

    } catch (error) {
        console.error('❌ Erreur serveur:', error);
        return {
            statusCode: 500,  // Internal Server Error
            body: JSON.stringify({ message: 'Erreur interne du serveur.' })
        };
    }
};
