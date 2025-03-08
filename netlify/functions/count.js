const mongoose = require('mongoose');
const Annonce = require('../../models/Annonce'); // Vérifie le chemin

const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';

// ✅ Connexion à MongoDB (évite les connexions multiples)
const dbConnect = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("✅ Connecté à MongoDB");
        } catch (error) {
            console.error("❌ Erreur de connexion MongoDB:", error);
            throw new Error("Impossible de se connecter à la base de données");
        }
    }
};

exports.handler = async (event, context) => {
    console.log("📩 Requête reçue :", event.httpMethod, event.queryStringParameters);

    // ✅ **Gérer les requêtes préflight CORS (OPTIONS)**
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    // ✅ **Autoriser uniquement GET**
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,  // Method Not Allowed
            body: JSON.stringify({ success: false, message: 'Méthode non autorisée. Utilisez GET.' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json',
            }
        };
    }

    try {
        await dbConnect(); // ✅ Connexion à la base de données

        // ✅ **Vérification des paramètres de requête**
        const vendeur = event.queryStringParameters?.vendeur?.trim();
        const contact = event.queryStringParameters?.contact?.trim();

        if (!vendeur || !contact) {
            return {
                statusCode: 400,  // Bad Request
                body: JSON.stringify({ success: false, message: 'Paramètres manquants : vendeur et contact sont nécessaires.' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Content-Type': 'application/json',
                }
            };
        }

        // ✅ **Récupérer le nombre d'annonces pour ce vendeur et contact**
        const annoncesCount = await Annonce.countDocuments({ emailVendeur: vendeur, contactPrincipal: contact });

        // ✅ **Retourner la réponse avec le nombre d'annonces**
        return {
            statusCode: 200,  // OK
            body: JSON.stringify({ success: true, annoncesCount }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json',
            }
        };
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des annonces:", error);
        return {
            statusCode: 500,  // Internal Server Error
            body: JSON.stringify({
                success: false,
                message: "Erreur serveur lors de la récupération des annonces",
                error: error.message
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json',
            }
        };
    }
};
