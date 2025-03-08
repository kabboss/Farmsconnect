const mongoose = require('mongoose');
const Annonce = require('../../models/Annonce'); // Vérifie le chemin
require('dotenv').config();

// ✅ Connexion à MongoDB (évite les connexions multiples)
const dbConnect = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect('mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("✅ Connecté à MongoDB");
        } catch (error) {
            console.error("❌ Erreur de connexion MongoDB:", error);
            throw new Error("Impossible de se connecter à la base de données");
        }
    }
};

exports.handler = async (event) => {
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

        // ✅ **Récupération et validation des paramètres de pagination**
        const page = Math.max(1, parseInt(event.queryStringParameters?.page) || 1); // Min 1
        const limit = Math.min(50, Math.max(1, parseInt(event.queryStringParameters?.limit) || 10)); // Min 1, Max 50
        const skip = (page - 1) * limit;

        // ✅ **Pipeline d'agrégation pour regrouper les annonces par catégorie et tranche de prix**
        const annonces = await Annonce.aggregate([
            {
                $addFields: {
                    priceBucket: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$prix", 500] }, then: "0-500" },
                                { case: { $lte: ["$prix", 1000] }, then: "501-1000" },
                                { case: { $lte: ["$prix", 2000] }, then: "1001-2000" },
                                { case: { $lte: ["$prix", 5000] }, then: "2001-5000" },
                                { case: { $gt: ["$prix", 5000] }, then: "5000+" }
                            ],
                            default: "Autres"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { categorie: "$categorie", priceBucket: "$priceBucket" },
                    totalAnnonces: { $sum: 1 },
                    annonces: { $push: "$$ROOT" }
                }
            },
            { $sort: { "_id.categorie": 1, "_id.priceBucket": 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalCount = await Annonce.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                totalPages,
                currentPage: page,
                totalCount,
                annonces
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json',
            }
        };
    } catch (error) {
        console.error("❌ Erreur API:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Erreur lors de la récupération des annonces",
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
